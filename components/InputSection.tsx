
import React, { useState, useRef } from 'react';
import { CareerInput, CareerFile } from '../types';
import { Upload, X, Send, FileText, Info } from 'lucide-react';

interface Props {
  onSubmit: (data: CareerInput) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<CareerFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const filePromises = Array.from(selectedFiles).map((file: File) => {
      return new Promise<CareerFile | null>((resolve) => {
        if (file.size > 10 * 1024 * 1024) {
          alert(`파일 '${file.name}'의 크기가 10MB를 초과합니다.`);
          resolve(null);
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          resolve({ name: file.name, mimeType: file.type, data: base64Data });
        };
        reader.readAsDataURL(file);
      });
    });

    const results = await Promise.all(filePromises);
    const validFiles = results.filter((f): f is CareerFile => f !== null);
    setFiles(prev => [...prev, ...validFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 10 && files.length === 0) {
      alert("분석을 위해 충분한 정보를 제공해주세요.");
      return;
    }
    onSubmit({ text, files });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">커리어 에셋 제출</h3>
            <p className="text-xs text-slate-400">이력서 파일 또는 텍스트로 상세 경력을 알려주세요.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">상세 경력 기술</label>
            <textarea
              className="w-full h-64 p-5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm leading-relaxed"
              placeholder="예: 20년 경력의 마케팅 전문가로서 글로벌 소비재 기업의 브랜드 매니징을 담당했습니다..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              onClick={() => !isLoading && fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
            >
              <Upload size={32} className="text-slate-300 group-hover:text-indigo-500" />
              <div className="text-center">
                <span className="block text-sm font-bold text-slate-600">이력서 파일 업로드</span>
                <span className="text-[11px] text-slate-400">PDF, DOCX 지원 (최대 10MB)</span>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 block">업로드된 파일 ({files.length})</span>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg group">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText size={14} className="text-indigo-500 shrink-0" />
                      <span className="text-xs font-medium text-slate-600 truncate">{f.name}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                      className="p-1 text-slate-300 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {files.length === 0 && (
                  <div className="h-24 flex items-center justify-center border border-slate-100 rounded-lg text-[11px] text-slate-300 italic">
                    파일이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-xl">
            <Info size={16} className="text-indigo-500 shrink-0" />
            <p className="text-[11px] text-indigo-700 leading-relaxed">
              입력하신 정보는 외부로 유출되지 않으며, Gemini AI 엔진을 통한 분석 목적으로만 일시적으로 사용됩니다.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:translate-y-0"
          >
            {isLoading ? "분석 진행 중..." : "AI 정밀 진단 시작하기"}
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
