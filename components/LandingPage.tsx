
import React, { useState } from 'react';
import { 
  Lock, ArrowRight, ExternalLink, HelpCircle, Sparkles, 
  Globe, Key, ListOrdered, ShieldCheck
} from 'lucide-react';
import { testConnection } from '../services/geminiService';

interface Props {
  onStart: (apiKey: string) => void;
}

export const LandingPage: React.FC<Props> = ({ onStart }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError("API 키를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await testConnection(apiKey);
      if (result.success) {
        onStart(apiKey);
      } else {
        setError("유효하지 않은 API 키입니다. 다시 확인해주세요.");
      }
    } catch (err) {
      setError("연결에 실패했습니다. 키를 다시 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 md:p-10 font-['Noto_Sans_KR']">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Card: Main Input Section */}
        <div className="lg:col-span-7 bg-white rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-white flex flex-col p-10 md:p-20 relative overflow-hidden">
          <div className="relative z-10">
            {/* Logo Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-12 shadow-lg">
              <Sparkles size={12} className="text-indigo-400" /> Platinum Career Lab
            </div>
            
            {/* Main Title */}
            <h1 className="text-[44px] md:text-[64px] font-black text-slate-900 mb-8 leading-[1.15] tracking-tight break-keep">
              중장년의 경력은<br/>
              <span className="text-indigo-600">성장의 끝이 아닙니다.</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg text-slate-500 mb-16 font-medium leading-relaxed max-w-md">
              4060 전문가의 깊은 내공을 데이터로 증명합니다.<br/>
              AI 정밀 진단으로 당신의 '두 번째 전성기'를 설계하세요.
            </p>
            
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Lock className="text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                </div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Gemini API Key를 입력하세요"
                  className="w-full pl-16 pr-6 py-6 bg-[#f8fafc] border-2 border-slate-50 rounded-[2rem] focus:border-indigo-600 focus:bg-white outline-none transition-all text-slate-800 font-bold placeholder:text-slate-300"
                />
              </div>
              
              {error && <p className="text-red-500 text-xs font-bold px-4 animate-fade-in">⚠️ {error}</p>}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#94a3b8] text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-[#0f172a] transition-all shadow-xl active:scale-95 disabled:opacity-50"
              >
                {isLoading ? "가동 중..." : "커리어 엔진 가동"} 
                <ArrowRight size={24} />
              </button>
            </form>

            {/* Social Proof */}
            <div className="mt-16 flex items-center gap-6 pt-10">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+50}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 font-bold">
                <span className="text-slate-900">500+</span> 중장년 전문가가 선택한<br/>프리미엄 커리어 리포트
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: API Guide & Support */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Guide Card */}
          <div className="bg-[#0f172a] p-10 md:p-14 rounded-[3.5rem] shadow-2xl text-white flex flex-col h-full border border-slate-800">
            <h2 className="text-2xl font-black mb-12 flex items-center gap-4">
              <ListOrdered className="text-indigo-400" size={28} />
              API 키 발급 안내
            </h2>
            
            <div className="space-y-12 flex-grow">
              <div className="flex gap-6 group cursor-default">
                <div className="w-12 h-12 shrink-0 bg-white/5 rounded-2xl flex items-center justify-center font-black text-indigo-400 border border-white/10 group-hover:bg-indigo-600 group-hover:text-white transition-all text-lg">1</div>
                <div>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 group/link"
                  >
                    <h3 className="font-black text-xl group-hover/link:text-indigo-400 transition-colors">Google AI Studio 접속</h3>
                    <ExternalLink size={18} className="text-slate-500 group-hover/link:text-indigo-400" />
                  </a>
                  <p className="text-sm text-slate-400 font-medium mt-2 leading-relaxed">구글 계정으로 로그인 후 API 발급 페이지로 이동합니다.</p>
                </div>
              </div>

              <div className="flex gap-6 group cursor-default">
                <div className="w-12 h-12 shrink-0 bg-white/5 rounded-2xl flex items-center justify-center font-black text-indigo-400 border border-white/10 group-hover:bg-indigo-600 group-hover:text-white transition-all text-lg">2</div>
                <div>
                  <h3 className="font-black text-xl">API 키 생성 (무료)</h3>
                  <p className="text-sm text-slate-400 font-medium mt-2 leading-relaxed">'Create API key in new project' 버튼을 눌러 새로운 키를 생성하세요.</p>
                </div>
              </div>

              <div className="flex gap-6 group cursor-default">
                <div className="w-12 h-12 shrink-0 bg-white/5 rounded-2xl flex items-center justify-center font-black text-indigo-400 border border-white/10 group-hover:bg-indigo-600 group-hover:text-white transition-all text-lg">3</div>
                <div>
                  <h3 className="font-black text-xl">키 복사 및 입력</h3>
                  <p className="text-sm text-slate-400 font-medium mt-2 leading-relaxed">발급된 키를 복사하여 왼쪽 입력창에 붙여넣고 엔진을 가동합니다.</p>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="mt-16 p-8 bg-white/5 rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle size={18} className="text-[#f59e0b]" />
                <span className="font-black text-[10px] uppercase tracking-widest text-[#f59e0b]">SECURITY NOTE</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                입력하신 API 키는 브라우저 세션 중에만 사용되며 별도로 저장되지 않습니다. 안심하고 분석을 진행하셔도 좋습니다.
              </p>
            </div>
          </div>

          {/* Support Banner */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-white flex items-center justify-between group cursor-pointer hover:border-indigo-600 transition-all px-10">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                <Globe size={28} />
              </div>
              <div>
                <p className="font-black text-slate-900 text-lg tracking-tight">Global Career Support</p>
                <p className="text-[11px] text-slate-400 font-bold">전 세계 어디서든 정밀 분석 가능</p>
              </div>
            </div>
            <ArrowRight size={24} className="text-slate-200 group-hover:text-indigo-600 transition-all" />
          </div>
        </div>

      </div>
      
      {/* Footer Copyright */}
      <div className="fixed bottom-6 left-0 right-0 text-center pointer-events-none">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          © 2026 ACLPro. All rights reserved
        </p>
      </div>
    </div>
  );
};
