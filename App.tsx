import React, { useState } from 'react';
import { LayoutDashboard, RotateCcw, TrendingUp } from 'lucide-react';
import DataUploader from './components/DataUploader.tsx';  // 添加 .tsx
import VariableSelector from './components/VariableSelector.tsx';  // 添加 .tsx
import RegressionResults from './components/RegressionResults.tsx';  // 添加 .tsx
import { performRegression } from './services/mathService';
import { DataRow, VariableSelection, RegressionResult } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [filename, setFilename] = useState<string | null>(null);
  
  const [selection, setSelection] = useState<VariableSelection>({
    dependent: null,
    independent: [],
    controls: []
  });

  const [result, setResult] = useState<RegressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDataLoaded = (loadedData: DataRow[], loadedCols: string[], name: string) => {
    setData(loadedData);
    setColumns(loadedCols);
    setFilename(name);
    // Reset state
    setSelection({ dependent: null, independent: [], controls: [] });
    setResult(null);
    setError(null);
  };

  const runRegression = () => {
    if (!selection.dependent || selection.independent.length === 0) return;
    
    setError(null);
    try {
      const res = performRegression(
        data,
        selection.dependent,
        selection.independent,
        selection.controls
      );
      setResult(res);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Regression analysis failed.");
    }
  };

  const resetAll = () => {
    setData([]);
    setColumns([]);
    setFilename(null);
    setResult(null);
    setSelection({ dependent: null, independent: [], controls: [] });
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <TrendingUp size={20} />
             </div>
             <h1 className="text-xl font-bold text-slate-900 tracking-tight">Regression<span className="text-indigo-600">AI</span></h1>
          </div>
          <div className="flex items-center gap-4">
            {filename && (
              <span className="text-sm px-3 py-1 bg-slate-100 rounded-full text-slate-600 font-medium border border-slate-200 hidden sm:inline-block">
                {filename}
              </span>
            )}
            {data.length > 0 && (
              <button 
                onClick={resetAll}
                className="text-slate-500 hover:text-red-600 transition-colors"
                title="Reset Application"
              >
                <RotateCcw size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Step 1: Upload */}
        {data.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-8 max-w-lg">
              <h2 className="text-3xl font-bold text-slate-800 mb-3">Multivariate Analysis Made Simple</h2>
              <p className="text-slate-500 text-lg">
                Upload your Excel dataset to perform linear regression with instant statistical breakdown and AI-powered insights.
              </p>
            </div>
            <DataUploader onDataLoaded={handleDataLoaded} />
          </div>
        )}

        {/* Step 2: Configure & Results */}
        {data.length > 0 && (
          <div className="space-y-8">
            
            {/* Variable Selection Area - Hide if results are shown to clean up UI, or keep collapsible?
                Let's keep it visible but maybe less prominent if result is there, or just keep it top.
                For this app, keeping it visible allows easy tweaking.
            */}
            {!result && (
              <div className="animate-in slide-in-from-bottom-8 duration-500">
                <div className="flex items-center gap-2 mb-6">
                  <LayoutDashboard className="text-indigo-600" size={24} />
                  <h2 className="text-2xl font-bold text-slate-800">Model Configuration</h2>
                </div>
                <VariableSelector 
                  columns={columns}
                  selection={selection}
                  setSelection={setSelection}
                  onRunRegression={runRegression}
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">Analysis Error</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                    <button onClick={() => setError(null)} className="mt-2 text-xs font-bold text-red-800 hover:underline">Dismiss</button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Results */}
            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-2">
                    <TrendingUp className="text-indigo-600" size={24} />
                    <h2 className="text-2xl font-bold text-slate-800">Regression Results</h2>
                   </div>
                   <button 
                     onClick={() => setResult(null)} 
                     className="text-sm text-indigo-600 font-semibold hover:underline"
                   >
                     Edit Variables
                   </button>
                </div>
                <RegressionResults result={result} selection={selection} />
              </div>
            )}

          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} RegressionAI. Powered by Math.js & Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;