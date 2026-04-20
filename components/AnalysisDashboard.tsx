
import React from 'react';
import { AnalysisResult } from '../types';
import { Star, Globe, MessageCircle, Briefcase, Award, TrendingUp, ChevronRight } from 'lucide-react';

interface Props {
  data: AnalysisResult;
  onSelectJob: (jobName: string) => void;
}

export const AnalysisDashboard: React.FC<Props> = ({ data, onSelectJob }) => {
  const safeSkills = (data?.skills || []);
  const safeExpandedJobs = (data?.expandedJobs || []).slice(0, 10);
  const skillIcons = [Star, Globe, MessageCircle, Briefcase, Award];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">커리어 분석 리포트</h2>
          <p className="text-sm text-slate-500">AI가 분석한 당신의 핵심 역량과 새로운 기회입니다.</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-xs font-bold text-indigo-600">
          분석 완료 • Gemini 3 Flash
        </div>
      </div>

      {/* Skills Row - Adjusted to 2 rows (3+2) for better balance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeSkills.map((skill, idx) => {
          const Icon = skillIcons[idx % skillIcons.length];
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 hover:border-indigo-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <div className="px-2 py-1 bg-slate-50 rounded text-[9px] font-bold text-slate-400 uppercase tracking-widest">Skill 0{idx+1}</div>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase block tracking-wider mb-1">{skill.type}</span>
                <h4 className="font-bold text-slate-700 text-base truncate">{skill.name}</h4>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-400">Proficiency</span>
                  <span className="text-indigo-600">{skill.proficiency}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-1000" 
                    style={{ width: `${skill.proficiency}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommended Jobs Section - Adjusted to 2 rows for better balance */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <Briefcase className="text-indigo-500" size={20} />
          <h3 className="font-bold text-slate-800">취업 가능성이 높은 적합 직무 (TOP 5)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100">
          {(data?.recommendedJobs || []).slice(0, 5).map((job, idx) => (
            <div key={idx} className="bg-white p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded">
                  FIT {job.fit}%
                </div>
                <span className="text-[10px] font-black text-slate-200">0{idx + 1}</span>
              </div>
              <h4 className="font-bold text-slate-800 text-sm leading-tight h-10 flex items-center">{job.jobName}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{job.reason}</p>
              <div className="flex flex-wrap gap-1">
                {job.strengths.slice(0, 3).map((s, i) => (
                  <span key={i} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">#{s}</span>
                ))}
              </div>
            </div>
          ))}
          {/* Empty state filler to maintain grid balance if needed, or just let it be */}
          <div className="hidden lg:flex bg-slate-50/30 items-center justify-center p-6">
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">End of Recommendations</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Expansion Jobs Card - Converted to 2-column grid for better balance */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-indigo-500" size={20} />
              <h3 className="font-bold text-slate-800">추천 커리어 확장 경로 (TOP 10), 아래의 원하는 업종의 직무를 클릭하세요!!!</h3>
            </div>
            <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest">
              Expansion Paths
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y divide-x-0 md:divide-x divide-slate-100">
            {safeExpandedJobs.map((job, idx) => (
              <div 
                key={idx} 
                className="p-5 flex items-center justify-between group hover:bg-slate-50 transition-all cursor-pointer"
                onClick={() => onSelectJob(job.jobName)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 font-black flex items-center justify-center text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">{job.industry}</span>
                    <h4 className="font-bold text-slate-700 text-sm group-hover:text-indigo-600 transition-colors">{job.jobName}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-300 block uppercase">Match</span>
                    <span className="text-sm font-black text-indigo-600">{job.fitScore}%</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-all">
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Insight/Summary Card */}
        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-lg shadow-indigo-100 space-y-4">
            <h4 className="text-lg font-bold leading-tight">중장년의 새로운 무대는<br/>지금부터 시작입니다.</h4>
            <p className="text-sm text-indigo-100 leading-relaxed opacity-80">
              분석된 10가지 경로 중 가장 가슴 뛰는 직무를 선택해주세요. 그 직무를 정복하기 위한 5가지 성공 전략 모델을 제안해 드립니다.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h5 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3">분석 결과 요약</h5>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Star size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600">강점 분야</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">상위 3개 핵심 역량이 조화롭게 분포되어 있습니다.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Globe size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600">확장 가능성</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">인접 산업군으로의 전환이 용이한 기술적 내공을 보유함.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
