import { useState } from 'react';
import { Bot, Mic, Wrench, Home } from 'lucide-react';
import RoutineBuilder from './components/RoutineBuilder';
import VoiceOptimizer from './components/VoiceOptimizer';
import Diagnostics from './components/Diagnostics';

export default function App() {
  const [activeTab, setActiveTab] = useState('routine');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col md:flex-row font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-2 shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2 mt-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bot size={20} className="text-white" />
          </div>
          <h1 className="font-bold text-lg leading-tight tracking-tight">Alexa Architect</h1>
        </div>
        
        <NavButton 
          active={activeTab === 'routine'} 
          onClick={() => setActiveTab('routine')}
          icon={<Home size={18} />}
          label="Routine Builder"
        />
        <NavButton 
          active={activeTab === 'voice'} 
          onClick={() => setActiveTab('voice')}
          icon={<Mic size={18} />}
          label="Voice Optimizer"
        />
        <NavButton 
          active={activeTab === 'diagnostics'} 
          onClick={() => setActiveTab('diagnostics')}
          icon={<Wrench size={18} />}
          label="Diagnostics"
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'routine' && <RoutineBuilder />}
          {activeTab === 'voice' && <VoiceOptimizer />}
          {activeTab === 'diagnostics' && <Diagnostics />}
        </div>
      </main>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
        active 
          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
