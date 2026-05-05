
import React from 'react';
import { CareerModel } from '../types';
import { Target, ChevronRight, Info } from 'lucide-react';

interface Props {
  targetJob: string;
  models: CareerModel[];
  onSelect: (modelType: string, duration: number) => void;
  isLoading: boolean;
}

export const ModelSelection: React.FC<Props> = ({ targetJob, models, onSelect, isLoading }) => {
  const [duration, setDuration] = React.useState<number>(12);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
            <Target size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">목표: <span className="text-indigo-600">{targetJob}</span></h2>
            <p className="text-sm text-slate-400">목표 달성을 위한 가장 최적의 진입 모델을 선택하세요.</p>
          </div>
        </div>

        {/* Duration Selection */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl">
          {[3, 6, 12].map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                duration === d 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {d}개월
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div
            key={model.type}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col group transition-all hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-50/50"
          >
            <div className="p-6 flex-grow space-y-6">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 font-black flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {model.type}
                </div>
                <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model</div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 leading-snug min-h-[44px]">{model.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-4">
                  {model.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">BEST SUITED FOR</span>
                <p className="text-xs font-bold text-slate-700">{model.suitability}</p>
              </div>
            </div>

            <button
              onClick={() => !isLoading && onSelect(model.type, duration)}
              disabled={isLoading}
              className="w-full py-4 bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all rounded-b-2xl border-t border-slate-100 flex items-center justify-center gap-2 group-hover:bg-indigo-600 group-hover:text-white"
            >
              {isLoading ? "생성 중..." : `${duration}개월 전략 수립`}
              <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-100 rounded-2xl p-6 flex items-start gap-4">
        <Info size={20} className="text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed">
          각 모델은 중장년의 기존 경력과 목표 직무 간의 '역량 매칭도'와 '시장 수요'를 고려하여 생성되었습니다. 본인의 성향(안정 지향 vs 도전 지향)에 맞춰 선택해 주십시오.
        </p>
      </div>
    </div>
  );
};
