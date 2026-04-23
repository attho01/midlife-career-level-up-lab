
import React, { useState } from 'react';
import { usePDF } from 'react-to-pdf';
import { AnalysisResult, StrategyResult, CareerModel } from '../types';
import { 
  Printer, RefreshCcw, Briefcase, GraduationCap, 
  TrendingUp, Calendar, ArrowRight, ShieldCheck, 
  FileCheck, Clock, BookOpen, GitCompare, CheckCircle2, XCircle, Download,
  Star, Send
} from 'lucide-react';

interface Props {
  analysis: AnalysisResult;
  strategy: StrategyResult;
  selectedModel: CareerModel;
  allModels: CareerModel[];
  targetJob: string;
  duration: number;
  onDurationChange: (duration: number) => void;
  onReset: () => void;
}

// 텍스트 내의 주요 키워드(경력개발, 취업준비 등)를 강조하는 헬퍼 함수
const formatStrategyText = (text: any) => {
  const renderSection = (title: string, content: string, icon: React.ReactNode) => (
    <div className="flex gap-3 items-start">
      <div className="mt-0.5 text-indigo-500 shrink-0">{icon}</div>
      <div>
        <h5 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">{title}</h5>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">{content}</p>
      </div>
    </div>
  );

  if (typeof text === 'object' && text !== null) {
    return (
      <div className="space-y-6">
        {renderSection('경력개발', text.careerDev, <GraduationCap size={18} />)}
        {renderSection('취업준비', text.jobPrep, <FileCheck size={18} />)}
        {renderSection('구직전략', text.searchStrategy, <Briefcase size={18} />)}
        {renderSection('리스크관리', text.riskMgmt, <ShieldCheck size={18} />)}
      </div>
    );
  }

  // Fallback for old string format
  const stringText = String(text);
  const sections = stringText.split(/(?=\[?(?:경력개발|취업준비|구직전략|리스크관리)\]?:?)/g);
  
  return (
    <div className="space-y-6">
      {sections.map((section, i) => {
        const trimmed = section.trim();
        if (!trimmed) return null;
        
        let title = '';
        let content = trimmed;
        let icon = <ArrowRight size={18} />;

        if (trimmed.includes('경력개발')) { title = '경력개발'; content = trimmed.replace(/\[?경력개발\]?:?/g, '').trim(); icon = <GraduationCap size={18} />; }
        else if (trimmed.includes('취업준비')) { title = '취업준비'; content = trimmed.replace(/\[?취업준비\]?:?/g, '').trim(); icon = <FileCheck size={18} />; }
        else if (trimmed.includes('구직전략')) { title = '구직전략'; content = trimmed.replace(/\[?구직전략\]?:?/g, '').trim(); icon = <Briefcase size={18} />; }
        else if (trimmed.includes('리스크관리')) { title = '리스크관리'; content = trimmed.replace(/\[?리스크관리\]?:?/g, '').trim(); icon = <ShieldCheck size={18} />; }
        
        if (title) {
          return <React.Fragment key={i}>{renderSection(title, content, icon)}</React.Fragment>;
        }
        
        return <p key={i} className="text-sm text-slate-600 leading-relaxed mb-4 last:mb-0">{trimmed}</p>;
      })}
    </div>
  );
};

export const FinalDashboard: React.FC<Props> = ({ analysis, strategy, selectedModel, allModels, targetJob, duration, onDurationChange, onReset }) => {
  const safeRoadmap = (strategy?.roadmap || []);
  const safeUpskilling = (strategy?.upskilling || []);
  
  const { toPDF, targetRef } = usePDF({filename: `${targetJob}_성공_로드맵.pdf`});

  const [compareModels, setCompareModels] = useState<string[]>([selectedModel.type]);
  
  // Feedback state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleCompareModel = (type: string) => {
    if (compareModels.includes(type)) {
      if (compareModels.length > 1) {
        setCompareModels(compareModels.filter(m => m !== type));
      }
    } else {
      if (compareModels.length < 3) {
        setCompareModels([...compareModels, type]);
      }
    }
  };

  const comparisonData = allModels.filter(m => compareModels.includes(m.type));

  const handleFeedbackSubmit = () => {
    if (rating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }
    // In a real app, this would send data to a backend
    console.log('Feedback submitted:', { rating, comment });
    setIsSubmitted(true);
  };

  return (
    <div className="animate-fade-in space-y-12 pb-24" ref={targetRef}>
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden no-print">
        <div className="p-8 md:p-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-100 shrink-0">
              <FileCheck size={40} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded">Executive Blueprint</span>
                <span className="text-xs font-bold text-slate-400">MODEL TYPE {selectedModel.type}</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900">{targetJob} 성공 로드맵</h2>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4" data-html2canvas-ignore>
            {/* Duration Selection in Dashboard */}
            <div className="flex items-center gap-1 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
              {[3, 6, 12].map((d) => (
                <button
                  key={d}
                  onClick={() => onDurationChange(d)}
                  className={`px-5 py-2.5 rounded-lg text-xs font-black transition-all ${
                    duration === d 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {d}개월
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => toPDF()}
                className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all border border-slate-200"
              >
                <Download size={18} /> PDF 다운로드
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all border border-slate-200"
              >
                <Printer size={18} /> 인쇄
              </button>
              <button 
                onClick={onReset}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <RefreshCcw size={18} /> 리셋
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Roadmap Section - 3 Column Grid */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 md:p-12 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
              <Calendar size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900">{duration}개월 통합 액션 플랜</h3>
              <p className="text-base text-slate-500 mt-2">성공적인 취업을 위한 단계별 핵심 전략 및 실행 지침</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {safeRoadmap.map((item, idx) => (
            <div key={idx} className="bg-slate-50 rounded-[2rem] p-8 md:p-10 border border-slate-100 relative group hover:bg-white hover:shadow-xl hover:shadow-indigo-50/50 hover:border-indigo-200 transition-all duration-300 flex flex-col">
              <div className="absolute top-0 left-8 w-20 h-2 bg-indigo-600 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-black text-indigo-600 bg-indigo-100 px-4 py-2 rounded-full uppercase tracking-widest">
                    PHASE 0{idx + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">{item.period}</span>
                </div>
                <h4 className="text-2xl font-black text-slate-800 leading-tight h-20 flex items-start group-hover:text-indigo-600 transition-colors">
                  {item.action}
                </h4>
              </div>
              
              <div className="h-px w-full bg-slate-200 mb-8 group-hover:bg-indigo-100 transition-colors"></div>
              
              <div className="flex-grow">
                {formatStrategyText(item.details)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 학습 및 역량 강화 위젯 */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8 md:p-10 space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <GraduationCap className="text-indigo-500" size={28} />
            <h3 className="text-xl font-black text-slate-800">역량 강화 브릿지</h3>
          </div>
          <div className="space-y-6">
            {safeUpskilling.map((item, i) => (
              <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">{item.category}</span>
                <h5 className="text-base font-bold text-slate-800 mb-2">{item.action}</h5>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.method}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 추천 학습 리소스 위젯 */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8 md:p-10 space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <BookOpen className="text-indigo-500" size={28} />
            <h3 className="text-xl font-black text-slate-800">추천 학습 리소스</h3>
          </div>
          <div className="space-y-6">
            {(strategy?.resources || []).map((res, i) => (
              <a 
                key={i} 
                href={res.link.startsWith('http') ? res.link : `https://www.google.com/search?q=${encodeURIComponent(res.link)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded">
                    {res.type}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{res.platform}</span>
                </div>
                <h5 className="text-base font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{res.title}</h5>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{res.reason}</p>
              </a>
            ))}
          </div>
        </div>

        {/* 리스크 제어 위젯 */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8 md:p-10 space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <TrendingUp className="text-red-500" size={28} />
            <h3 className="text-xl font-black text-slate-800">리스크 제어 시스템</h3>
          </div>
          <div className="space-y-6">
            {(strategy?.risks || []).map((risk, i) => (
              <div key={i} className="p-6 rounded-3xl bg-red-50/30 border border-red-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                  <p className="text-sm font-black text-red-700 uppercase">위험 요소: {risk.risk}</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium italic pl-5 border-l-2 border-red-200">
                  "{risk.mitigation}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 구직 전략 및 인터뷰 위젯 */}
        <div className="bg-slate-900 rounded-[2.5rem] shadow-xl p-8 md:p-10 text-white space-y-8 relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <ShieldCheck size={200} />
          </div>
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
              <Briefcase className="text-indigo-400" size={28} />
              <h3 className="text-xl font-black">실전 마켓 진입 전략</h3>
            </div>
            
            <div className="space-y-8">
              <div>
                <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] block mb-4">Target Channels</span>
                <div className="flex flex-wrap gap-2">
                  {(strategy?.jobHunt?.channels || []).map((ch, i) => (
                    <span key={i} className="px-4 py-2 bg-white/10 text-white text-xs font-bold rounded-xl border border-white/5">{ch}</span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] block mb-4">Interview Playbook</span>
                <ul className="space-y-4">
                  {(strategy?.jobHunt?.interviewTips || []).slice(0, 3).map((tip, i) => (
                    <li key={i} className="text-sm text-slate-300 font-medium leading-relaxed flex gap-3 italic">
                      <span className="text-indigo-400 font-bold shrink-0 text-lg">"</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6">
              <div className="p-6 bg-indigo-600 rounded-2xl flex items-center justify-between group/btn cursor-default">
                <span className="text-sm font-black tracking-widest uppercase">Success Guaranteed</span>
                <Clock size={20} className="animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Path Comparison Section */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 md:p-12 mt-12 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GitCompare size={28} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800">커리어 경로 비교 분석</h3>
              <p className="text-base text-slate-500 mt-2">최대 3개의 모델을 선택하여 장단점을 비교해보세요.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {allModels.map((model) => {
              const isSelected = compareModels.includes(model.type);
              return (
                <button
                  key={model.type}
                  onClick={() => toggleCompareModel(model.type)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                    isSelected 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  Model {model.type}
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto pb-6">
          <div className="flex gap-8 min-w-max">
            {comparisonData.map((model) => (
              <div key={model.type} className="w-[380px] shrink-0 flex flex-col bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden">
                <div className={`p-8 border-b ${model.type === selectedModel.type ? 'bg-indigo-600 text-white' : 'bg-white border-slate-100'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded ${
                      model.type === selectedModel.type ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      Model {model.type}
                    </span>
                    {model.type === selectedModel.type && (
                      <span className="text-xs font-bold bg-emerald-500 text-white px-3 py-1.5 rounded-full">
                        현재 선택됨
                      </span>
                    )}
                  </div>
                  <h4 className={`text-2xl font-bold leading-tight ${model.type === selectedModel.type ? 'text-white' : 'text-slate-800'}`}>
                    {model.title}
                  </h4>
                </div>
                
                <div className="p-8 flex-grow flex flex-col gap-8">
                  <div>
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">적합성</h5>
                    <p className="text-base text-slate-700 leading-relaxed font-medium">{model.suitability}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                      <CheckCircle2 size={16} /> 장점 (Pros)
                    </h5>
                    <ul className="space-y-3">
                      {(model.pros || []).map((pro, i) => (
                        <li key={i} className="text-sm text-slate-600 leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-emerald-400 before:rounded-full">
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                      <XCircle size={16} /> 단점 및 리스크 (Cons)
                    </h5>
                    <ul className="space-y-3">
                      {(model.cons || []).map((con, i) => (
                        <li key={i} className="text-sm text-slate-600 leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-red-400 before:rounded-full">
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 md:p-16 mt-12 overflow-hidden no-print" data-html2canvas-ignore>
        <div className="max-w-3xl mx-auto text-center">
          {isSubmitted ? (
            <div className="py-12 animate-fade-in">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-3">소중한 피드백 감사합니다!</h3>
              <p className="text-lg text-slate-500">보내주신 의견은 서비스 개선에 큰 도움이 됩니다.</p>
            </div>
          ) : (
            <>
              <h3 className="text-3xl font-black text-slate-800 mb-3">이 리포트가 도움이 되셨나요?</h3>
              <p className="text-base text-slate-500 mb-10">생성된 커리어 전략에 대한 의견을 남겨주세요.</p>
              
              <div className="flex justify-center gap-3 mb-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-2 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star 
                      size={48} 
                      className={`${(hoverRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'} transition-colors`} 
                    />
                  </button>
                ))}
              </div>

              <div className="relative mb-8 text-left">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="추가적인 의견이나 개선사항이 있다면 자유롭게 적어주세요."
                  className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 text-base text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none h-40"
                />
              </div>

              <button
                onClick={handleFeedbackSubmit}
                className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl text-lg font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                <Send size={20} /> 피드백 보내기
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
};
