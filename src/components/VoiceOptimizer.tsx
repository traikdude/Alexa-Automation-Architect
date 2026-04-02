import { useState } from 'react';
import { optimizeVoiceTrigger } from '../services/ai';
import { Loader2, Mic, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { motion } from 'motion/react';

export default function VoiceOptimizer() {
  const [phrase, setPhrase] = useState('');
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'alphabetical' | 'type'>('default');

  const handleOptimize = async () => {
    if (!phrase.trim()) return;
    setLoading(true);
    try {
      const results = await optimizeVoiceTrigger(phrase);
      const rankedResults = results.map((r: any, idx: number) => ({ ...r, originalRank: idx + 1 }));
      setVariations(rankedResults);
      setSortBy('default');
    } catch (error) {
      console.error(error);
      alert('Failed to optimize trigger. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const sortedVariations = [...variations].sort((a, b) => {
    if (sortBy === 'alphabetical') {
      return a.variation.localeCompare(b.variation);
    }
    if (sortBy === 'type') {
      return a.type.localeCompare(b.type);
    }
    return a.originalRank - b.originalRank;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-white">Voice Trigger Variation Engine</h2>
        <p className="text-slate-400">Alexa struggling to understand a specific phrase? Enter it below to generate phonetically optimized alternatives.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <label className="block text-sm font-medium text-slate-400 mb-2">Problematic Trigger Phrase</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mic size={18} className="text-slate-500" />
            </div>
            <input
              type="text"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleOptimize()}
              placeholder="e.g., Telemundo"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleOptimize}
            disabled={loading || !phrase.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Optimize'}
          </button>
        </div>
      </div>

      {variations.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-amber-400 bg-amber-400/10 border border-amber-400/20 px-4 py-3 rounded-lg flex-1">
              <AlertTriangle size={20} className="shrink-0" />
              <span className="text-sm font-medium">
                {sortBy === 'default' 
                  ? "Test these variations from top to bottom. The higher they are, the more likely Alexa is to understand them."
                  : "Variations are currently sorted. Pay attention to the original rank (#) for Alexa's recognition likelihood."}
              </span>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1 shrink-0">
              <ArrowUpDown size={16} className="text-slate-500 ml-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-sm text-slate-300 font-medium py-2 pl-2 pr-8 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="default">Ranked (Default)</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="type">Category Type</option>
              </select>
            </div>
          </div>

          <div className="grid gap-3">
            {sortedVariations.map((v) => (
              <div key={v.originalRank} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4 shadow-md hover:border-slate-700 transition-colors">
                <div className="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-slate-800 text-slate-400 shrink-0">
                  <span className="text-xs font-medium leading-none mb-0.5">Rank</span>
                  <span className="text-sm font-bold leading-none">#{v.originalRank}</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                    <h4 className="text-lg font-bold text-white">"{v.variation}"</h4>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 w-fit">
                      {v.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{v.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
