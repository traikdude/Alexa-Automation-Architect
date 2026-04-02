import { useState, useEffect } from 'react';
import { CheckSquare, RotateCcw } from 'lucide-react';

const checklist = [
  {
    category: "Permissions & Account",
    items: [
      "Alexa app is updated to latest version",
      "All Echo devices registered to same Amazon account",
      "Location permissions set to 'Always Allow' (for geofence triggers)",
      "Smart home device accounts linked and authorized",
      "Skills enabled and account linking current",
      "Voice profile set up (for Visual ID or voice-specific triggers)"
    ]
  },
  {
    category: "Connectivity & Devices",
    items: [
      "Echo device online and connected to WiFi",
      "Smart home devices showing 'Online' in Alexa app",
      "Smart home hub (if applicable) online and reachable",
      "Run 'Alexa, discover my devices' to refresh device list",
      "Verify device is assigned to correct room/group in Alexa app"
    ]
  },
  {
    category: "Routine Configuration",
    items: [
      "Routine is enabled (toggle is ON)",
      "Trigger phrase is unique (not conflicting with Skills or built-in commands)",
      "Action order follows terminal-action rules (music/skills last)",
      "No conflicting Routines with overlapping triggers"
    ]
  }
];

export default function Diagnostics() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Load saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem('alexa-diagnostics-progress');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved diagnostics progress', e);
      }
    }
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    localStorage.setItem('alexa-diagnostics-progress', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleItem = (sectionIdx: number, itemIdx: number) => {
    const key = `${sectionIdx}-${itemIdx}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your checklist progress?')) {
      setCheckedItems({});
    }
  };

  const totalItems = checklist.reduce((acc, section) => acc + section.items.length, 0);
  const completedItems = Object.values(checkedItems).filter(Boolean).length;
  const progressPercentage = Math.round((completedItems / totalItems) * 100) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-white">Departure Checklist</h2>
          <p className="text-slate-400">Systematic verification protocol when Routines fail. Go through these items before rebuilding.</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm font-medium shrink-0"
        >
          <RotateCcw size={16} />
          Reset Progress
        </button>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-300 font-medium">Completion Progress</span>
          <span className="text-blue-400 font-bold">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        {checklist.map((section, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-200">{section.category}</h3>
            </div>
            <div className="p-2">
              {section.items.map((item, itemIdx) => {
                const key = `${idx}-${itemIdx}`;
                const isChecked = !!checkedItems[key];
                
                return (
                  <label 
                    key={itemIdx} 
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isChecked ? 'bg-blue-900/10 hover:bg-blue-900/20' : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => toggleItem(idx, itemIdx)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" 
                      />
                    </div>
                    <span className={`text-sm leading-relaxed transition-colors ${
                      isChecked ? 'text-slate-500 line-through' : 'text-slate-300'
                    }`}>
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
