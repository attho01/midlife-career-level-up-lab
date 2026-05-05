import React from 'react';
import { StrategyResult, CareerModel } from '../types';

interface Props {
  strategy: StrategyResult;
  selectedModel: CareerModel;
  targetJob: string;
  onReset: () => void;
}

export const StrategyDashboard: React.FC<Props> = ({ strategy, selectedModel, targetJob, onReset }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-indigo-500 text-xs font-bold px-2 py-1 rounded">FINAL PLAN</span>
            <span className="text-gray-300 text-sm">Model {selectedModel.type}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{targetJob} 달성 전략</h1>
          <p className="text-gray-300 max-w-2xl">{selectedModel.title} — {selectedModel.description}</p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-1/4 translate-x-1/4">
             <svg width="300" height="300" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99z"/></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Roadmap (Taking up 2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Roadmap Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">📅 6-12개월 실행 로드맵</h3>
            <div className="relative border-l-2 border-indigo-200 ml-3 space-y-8">
              {strategy.roadmap.map((item, idx) => (
                <div key={idx} className="mb-8 ml-6 relative group">
                  <span className="absolute -left-[31px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 ring-4 ring-white">
                    <span className="text-xs text-white font-bold">{idx + 1}</span>
                  </span>
                  <h4 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                    {item.action}
                    <span className="ml-3 text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {item.period}
                    </span>
                  </h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm leading-relaxed border border-gray-100">
                    {item.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Upskilling Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">🚀 역량 강화 플랜</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {strategy.upskilling.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100 hover:border-blue-300 transition-colors">
                  <span className="text-xs font-bold text-blue-600 uppercase mb-1 block">{item.category}</span>
                  <h4 className="font-bold text-gray-800 mb-1">{item.action}</h4>
                  <p className="text-sm text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                    {item.method}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Job Hunt & Risks */}
        <div className="space-y-8">
          
          {/* Job Hunt */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">💼 취업 공략</h3>
            
            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-700 mb-2">추천 채용 채널</h4>
              <div className="flex flex-wrap gap-2">
                {strategy.jobHunt.channels.map((ch, i) => (
                  <span key={i} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{ch}</span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-700 mb-2">이력서 핵심 전략</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {strategy.jobHunt.resumeTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

             <div>
              <h4 className="text-sm font-bold text-gray-700 mb-2">인터뷰 포인트</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {strategy.jobHunt.interviewTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Risk Management */}
          <div className="bg-red-50 p-6 rounded-xl shadow-md border border-red-100">
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
               리스크 관리
            </h3>
            <div className="space-y-4">
               {strategy.risks.map((risk, idx) => (
                 <div key={idx}>
                   <p className="text-sm font-bold text-red-700 mb-1">⚠️ {risk.risk}</p>
                   <p className="text-sm text-red-600 pl-4 border-l-2 border-red-200">{risk.mitigation}</p>
                 </div>
               ))}
            </div>
          </div>

          <button 
            onClick={onReset}
            className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
          >
            처음부터 다시 분석하기
          </button>

        </div>
      </div>
    </div>
  );
};