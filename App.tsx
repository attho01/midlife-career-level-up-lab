
import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { InputSection } from './components/InputSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ModelSelection } from './components/ModelSelection';
import { FinalDashboard } from './components/FinalDashboard';
import { analyzeCareerData, generateStrategy, generateCareerModels } from './services/geminiService';
import { AnalysisResult, StrategyResult, Step, CareerInput, CareerModel } from './types';
import { 
  LogOut, 
  Loader2, 
  LayoutDashboard, 
  FileEdit, 
  Target, 
  ClipboardCheck, 
  User, 
  Settings, 
  Bell,
  Menu,
  X
} from 'lucide-react';

function App() {
  const [step, setStep] = useState<Step>('LANDING');
  const [apiKey, setApiKey] = useState<string>('');
  const [careerData, setCareerData] = useState<CareerInput | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [targetJobModels, setTargetJobModels] = useState<CareerModel[]>([]);
  const [selectedTargetJob, setSelectedTargetJob] = useState<string>('');
  const [selectedModelType, setSelectedModelType] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(12);
  const [strategyResult, setStrategyResult] = useState<StrategyResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleStart = (key: string) => {
    setApiKey(key);
    setStep('INPUT');
  };

  const handleAnalysis = async (inputData: CareerInput) => {
    setLoading(true);
    setLoadingMessage('경력 자산 분석 중...');
    setCareerData(inputData);
    try {
      const result = await analyzeCareerData(inputData, apiKey);
      setAnalysisResult(result as AnalysisResult);
      setStep('ANALYZING');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      alert("분석 중 오류가 발생했습니다. API 키나 입력 데이터를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleJobSelect = async (jobName: string) => {
    setLoading(true);
    setLoadingMessage('전략적 모델 생성 중...');
    setSelectedTargetJob(jobName);
    try {
      const models = await generateCareerModels(jobName, careerData!, apiKey);
      setTargetJobModels(models);
      setStep('MODEL_SELECTION');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error(error);
      alert(`모델 생성 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = async (modelType: string, duration: number) => {
    setLoading(true);
    setLoadingMessage(`${duration}개월 블루프린트 수립 중...`);
    setSelectedModelType(modelType);
    setSelectedDuration(duration);
    try {
      const result = await generateStrategy(selectedTargetJob, modelType, careerData!, apiKey, duration);
      setStrategyResult(result);
      setStep('DASHBOARD');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error(error);
      alert(`전략 수립 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDurationChange = async (duration: number) => {
    if (duration === selectedDuration) return;
    
    setLoading(true);
    setLoadingMessage(`${duration}개월 블루프린트 재구성 중...`);
    setSelectedDuration(duration);
    try {
      const result = await generateStrategy(selectedTargetJob, selectedModelType!, careerData!, apiKey, duration);
      setStrategyResult(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error(error);
      alert(`전략 재구성 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if(confirm("데이터를 초기화하고 처음으로 돌아갈까요?")) {
      setStep('LANDING');
      setApiKey('');
      setAnalysisResult(null);
      setStrategyResult(null);
      setTargetJobModels([]);
      setSelectedDuration(12);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (step === 'LANDING') {
    return <LandingPage onStart={handleStart} />;
  }

  const navItems = [
    { id: 'INPUT', label: '경력 입력', icon: FileEdit, active: step === 'INPUT' },
    { id: 'ANALYZING', label: '역량 분석', icon: LayoutDashboard, active: step === 'ANALYZING' },
    { id: 'MODEL_SELECTION', label: '모델 선택', icon: Target, active: step === 'MODEL_SELECTION' },
    { id: 'DASHBOARD', label: '결과 리포트', icon: ClipboardCheck, active: step === 'DASHBOARD' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3 border-b border-slate-50">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <span className="font-bold text-slate-800 tracking-tight">PLATINUM LAB</span>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 mt-4">
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-default ${
                  item.active 
                  ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm' 
                  : 'text-slate-400 opacity-60'
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-50 space-y-1">
            <button onClick={handleReset} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">
              <LogOut size={20} />
              <span className="text-sm font-medium">로그아웃 / 리셋</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top App Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-slate-50 rounded-lg lg:hidden"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-bold text-slate-800 truncate">
              {navItems.find(i => i.active)?.label || 'Workspace'}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Bell size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Settings size={20} />
            </button>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
              <User size={18} />
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-7xl mx-auto min-h-full flex flex-col">
            <div className="flex-grow">
              {step === 'INPUT' && (
                <InputSection onSubmit={handleAnalysis} isLoading={loading} />
              )}

              {step === 'ANALYZING' && analysisResult && (
                <AnalysisDashboard data={analysisResult} onSelectJob={handleJobSelect} />
              )}

              {step === 'MODEL_SELECTION' && (
                <ModelSelection 
                  targetJob={selectedTargetJob} 
                  models={targetJobModels} 
                  onSelect={handleModelSelect}
                  isLoading={loading}
                />
              )}

              {step === 'DASHBOARD' && strategyResult && analysisResult && selectedModelType && (
                <FinalDashboard 
                  analysis={analysisResult}
                  strategy={strategyResult}
                  selectedModel={targetJobModels.find(m => m.type === selectedModelType)!}
                  allModels={targetJobModels}
                  targetJob={selectedTargetJob}
                  duration={selectedDuration}
                  onDurationChange={handleDurationChange}
                  onReset={handleReset}
                />
              )}
            </div>

            {/* Footer Copyright */}
            <footer className="mt-12 py-8 border-t border-slate-100 text-center no-print">
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                © 2026 ACLPro. All rights reserved
              </p>
            </footer>
          </div>
        </main>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-[100] animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center border border-slate-100 max-w-xs text-center">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
            <h4 className="font-bold text-slate-800">{loadingMessage}</h4>
            <p className="text-xs text-slate-400 mt-2">시스템이 중장년의 데이터를 분석 중입니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
