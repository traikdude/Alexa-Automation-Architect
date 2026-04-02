import { useState } from 'react';
import { generateRoutineBlueprint } from '../services/ai';
import { Loader2, Sparkles, CheckCircle2, Copy, Download, Check } from 'lucide-react';
import { motion } from 'motion/react';

export default function RoutineBuilder() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const blueprint = await generateRoutineBlueprint(prompt);
      setResult(blueprint);
    } catch (error) {
      console.error(error);
      alert('Failed to generate blueprint. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `Routine Name: ${result.routineName}\nTrigger: ${result.trigger}\nTarget Device: ${result.device}\n\nAction Sequence:\n${result.actions.map((a: any, i: number) => `${i + 1}. [${a.actionType}] ${a.description}`).join('\n')}\n\nArchitect's Notes:\n${result.explanation}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${result.routineName.replace(/\s+/g, '_').toLowerCase()}_blueprint.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-white">Routine Blueprint Generator</h2>
        <p className="text-slate-400">Describe your automation idea in plain language, and I'll architect a complete Alexa Routine.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., I want a movie night routine that dims the lights, turns on the TV, and sets the thermostat to 70 degrees..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-y"
        />
        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? 'Architecting...' : 'Generate Blueprint'}
          </button>
        </div>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl"
        >
          <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-lg text-white">{result.routineName}</h3>
              <span className="bg-blue-500/20 text-blue-400 text-xs px-2.5 py-1 rounded-full font-medium border border-blue-500/20 hidden sm:inline-block">
                Ready to Build
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCopy} 
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" 
                title="Copy to Clipboard"
              >
                {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
              </button>
              <button 
                onClick={handleDownload} 
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" 
                title="Download JSON"
              >
                <Download size={18} />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Trigger</div>
                <div className="font-medium text-slate-200">{result.trigger}</div>
              </div>
              <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Target Device</div>
                <div className="font-medium text-slate-200">{result.device}</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Action Sequence</h4>
              <div className="space-y-2">
                {result.actions?.map((action: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800/50">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-medium text-blue-400 text-sm">{action.actionType}</div>
                      <div className="text-slate-300">{action.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-4">
              <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-2">
                <CheckCircle2 size={18} />
                Architect's Notes
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                {result.explanation}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
