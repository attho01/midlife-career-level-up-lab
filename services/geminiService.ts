
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, StrategyResult, CareerInput, CareerModel } from "../types";

export const testConnection = async (apiKey: string): Promise<{ success: boolean; message: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "OK",
      config: { maxOutputTokens: 5 }
    });
    return { success: !!response.text, message: response.text ? "연결 성공" : "응답 없음" };
  } catch (error: any) {
    return { success: false, message: error.message || "연결 실패" };
  }
};

const initialAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING },
          proficiency: { type: Type.NUMBER },
        },
        required: ["name", "type", "proficiency"]
      }
    },
    recommendedJobs: {
      type: Type.ARRAY,
      description: "취업 가능성이 높은 적합 직무 5개",
      items: {
        type: Type.OBJECT,
        properties: {
          jobName: { type: Type.STRING },
          fit: { type: Type.NUMBER },
          reason: { type: Type.STRING },
          fitAnalysis: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["jobName", "fit", "reason", "fitAnalysis", "strengths"]
      }
    },
    expandedJobs: {
      type: Type.ARRAY,
      description: "적합도 순으로 정렬된 10가지 확장 업종 및 직무",
      items: {
        type: Type.OBJECT,
        properties: {
          industry: { type: Type.STRING },
          jobName: { type: Type.STRING },
          fitScore: { type: Type.NUMBER },
          reason: { type: Type.STRING },
          synergy: { type: Type.STRING },
        },
        required: ["industry", "jobName", "fitScore", "reason", "synergy"]
      }
    }
  },
  required: ["skills", "recommendedJobs", "expandedJobs"]
};

const modelsSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      type: { type: Type.STRING },
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      suitability: { type: Type.STRING },
      pros: { type: Type.ARRAY, items: { type: Type.STRING } },
      cons: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["type", "title", "description", "suitability", "pros", "cons"]
  }
};

export const analyzeCareerData = async (input: CareerInput, apiKey: string): Promise<Partial<AnalysisResult>> => {
  const ai = new GoogleGenAI({ apiKey });
  const parts: any[] = [];
  input.files.forEach(f => parts.push({ inlineData: { mimeType: f.mimeType, data: f.data } }));
  parts.push({ text: `
    당신은 중장년 전문가의 커리어 전환을 돕는 전략가입니다. 
    사용자의 경력을 분석하여 다음을 도출하세요. 모든 응답은 한국어여야 합니다.
    1. 핵심 역량: 기술/비즈니스/소프트스킬 등 5개를 0~100 점수로 추출.
    2. 적합 직무 5선: 현재 경력에서 즉시 취업 가능성이 가장 높은 직무 5가지를 선정하고 적합도(fit %)와 분석 내용을 제공하세요.
    3. 확장 직무 10선: 사용자의 전문성을 활용하여 진입 가능한 새로운 업종과 직무 10가지를 '적합도(fitScore)'가 높은 순서대로 제안하세요. 
    데이터: ${input.text}
  ` });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: initialAnalysisSchema,
      },
    });
    
    if (!response.text) {
      throw new Error("AI로부터 응답이 없습니다. (Safety Filter에 의해 차단되었을 수 있습니다)");
    }

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("JSON Parse Error:", response.text);
      throw new Error("응답 데이터 형식이 올바르지 않습니다.");
    }
  } catch (error: any) {
    console.error("Analysis Error:", error);
    throw error;
  }
};

export const generateCareerModels = async (targetJob: string, input: CareerInput, apiKey: string): Promise<CareerModel[]> => {
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        사용자가 선택한 목표 직무: ${targetJob}
        사용자의 기존 경력 배경: ${input.text}
        이 목표 직무를 달성하기 위해 중장년 전문가가 선택할 수 있는 5가지 커리어패스 모델(유형 A~E)을 설계하세요. 
        각 모델별로 장점(pros)과 단점/리스크(cons)를 2-3가지씩 포함해주세요.
        모든 응답은 한국어입니다.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            models: modelsSchema
          }
        },
      },
    });

    if (!response.text) {
      throw new Error("AI로부터 응답이 없습니다. (모델 생성 실패)");
    }

    try {
      const data = JSON.parse(response.text);
      return data.models || [];
    } catch (e) {
      console.error("JSON Parse Error (Models):", response.text);
      throw new Error("모델 데이터 형식이 올바르지 않습니다.");
    }
  } catch (error: any) {
    console.error("Models Generation Error:", error);
    throw error;
  }
};

export const generateStrategy = async (targetJob: string, modelType: string, input: CareerInput, apiKey: string, duration: number = 12): Promise<StrategyResult> => {
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        당신은 중장년 전문가를 위한 커리어 전략가입니다.
        목표 직무: ${targetJob}
        선택 모델: ${modelType}
        사용자 데이터: ${input.text}
        전체 기간: ${duration}개월

        다음 지침에 따라 ${duration}개월 통합 커리어 로드맵을 수립하세요:
        1. 로드맵(roadmap): 전체 기간을 3등분하여 초반, 중반, 후반의 3개 아이템으로 구성하세요.
        2. 세부 내용(details): 각 단계마다 careerDev, jobPrep, searchStrategy, riskMgmt 항목을 반드시 포함하세요.
        3. 역량 강화(upskilling): 3-5개의 핵심 액션을 제안하세요.
        4. 구직 활동(jobHunt): 채널, 서류 팁, 면접 팁을 각각 3개 이상 포함하세요.
        5. 리소스(resources): 추천 온라인 강의, 아티클, 자격증을 3~5개 추천하세요.
        6. 리스크(risks): 예상되는 위험과 그에 맞는 현실적인 극복 방안을 제시하세요.

        모든 응답은 한국어로 작성하며, 제공된 JSON 스키마를 엄격히 준수하세요.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roadmap: { 
              type: Type.ARRAY, 
              description: `반드시 3개의 아이템(초반, 중반, 후반)을 포함해야 하며, 전체 기간은 ${duration}개월임`,
              items: { 
                type: Type.OBJECT, 
                properties: { 
                  period: { type: Type.STRING, description: "예: '1단계 (1-2개월)'" }, 
                  action: { type: Type.STRING, description: "단계별 핵심 목표 및 슬로건" }, 
                  details: { 
                    type: Type.OBJECT, 
                    description: "4대 관점이 통합된 상세 전략 리포트",
                    properties: {
                      careerDev: { type: Type.STRING, description: "경력개발 및 역량 보완 계획 (구체적인 액션)" },
                      jobPrep: { type: Type.STRING, description: "이력서, 포트폴리오 등 취업 준비 계획" },
                      searchStrategy: { type: Type.STRING, description: "구직 채널 및 네트워킹 전략" },
                      riskMgmt: { type: Type.STRING, description: "예상 리스크 및 극복 방안" }
                    },
                    required: ["careerDev", "jobPrep", "searchStrategy", "riskMgmt"]
                  } 
                },
                required: ["period", "action", "details"]
              } 
            },
            upskilling: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, action: { type: Type.STRING }, method: { type: Type.STRING } }, required: ["category", "action", "method"] } },
            jobHunt: { type: Type.OBJECT, properties: { channels: { type: Type.ARRAY, items: { type: Type.STRING } }, resumeTips: { type: Type.ARRAY, items: { type: Type.STRING } }, interviewTips: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["channels", "resumeTips", "interviewTips"] },
            risks: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { risk: { type: Type.STRING }, mitigation: { type: Type.STRING } }, required: ["risk", "mitigation"] } },
            resources: {
              type: Type.ARRAY,
              description: "추천 온라인 강의, 아티클, 자격증 (Upskilling 및 Career Development 기반)",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING, description: "Course, Article, 또는 Certification" },
                  platform: { type: Type.STRING, description: "제공 플랫폼 (예: Coursera, Udemy, 브런치 등)" },
                  link: { type: Type.STRING, description: "검색 키워드 또는 예상 URL" },
                  reason: { type: Type.STRING, description: "추천 사유" }
                },
                required: ["title", "type", "platform", "link", "reason"]
              }
            }
          },
          required: ["roadmap", "upskilling", "jobHunt", "risks", "resources"]
        },
      },
    });

    if (!response.text) {
      throw new Error("AI로부터 응답이 없습니다. (전략 수립 실패)");
    }

    try {
      return JSON.parse(response.text) as StrategyResult;
    } catch (e) {
      console.error("JSON Parse Error (Strategy):", response.text);
      throw new Error("전략 데이터 형식이 올바르지 않습니다.");
    }
  } catch (error: any) {
    console.error("Strategy Generation Error:", error);
    throw error;
  }
};
