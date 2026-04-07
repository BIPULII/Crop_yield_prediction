import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Predictor } from './components/Predictor';
import { TrainedModel } from './components/TrainedModel';
import { LayoutDashboard, TrendingUp, Github, FileText, ExternalLink, Cpu } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'predictor' | 'trained-model'>('predictor');

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase leading-none">CropYield AI</h1>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Predictive Agriculture v1.0</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            <button 
              onClick={() => setActiveTab('predictor')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                activeTab === 'predictor' ? "bg-white text-emerald-700 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <TrendingUp className="w-4 h-4" />
              Predictor
            </button>
            <button 
              onClick={() => setActiveTab('trained-model')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                activeTab === 'trained-model' ? "bg-white text-emerald-700 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <Cpu className="w-4 h-4" />
              ML Model
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                activeTab === 'dashboard' ? "bg-white text-emerald-700 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href="https://colab.research.google.com/drive/1N3cAZrVsAglGMbcDrUEUAn2QrKdM1Z5Q" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              View Colab
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h2 className="text-5xl font-black tracking-tighter mb-4 max-w-2xl leading-[0.9]">
            {activeTab === 'predictor' 
              ? 'Predict the future of your harvest.' 
              : activeTab === 'trained-model'
              ? 'Our ML Model Performance'
              : 'Visualizing the data behind the yield.'}
          </h2>
          <p className="text-zinc-500 max-w-xl font-medium leading-relaxed">
            {activeTab === 'predictor' 
              ? 'Enter your agricultural parameters below to generate a high-precision yield prediction based on historical data patterns.'
              : activeTab === 'trained-model'
              ? 'See how our Random Forest model predicts crop yield with 74% accuracy. Explore feature importance, model metrics, and detailed predictions.'
              : 'Explore the relationships between rainfall, pesticide use, and temperature that drive global crop production.'}
          </p>
        </div>

        {/* Content */}
        <div className="relative">
          {activeTab === 'predictor' ? <Predictor /> : activeTab === 'trained-model' ? <TrainedModel /> : <Dashboard />}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-black/5 py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
              <span className="font-black tracking-tighter uppercase">CropYield AI</span>
            </div>
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
              An experimental platform combining machine learning and agricultural data to help farmers and researchers optimize crop production worldwide.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-zinc-500 font-medium">
              <li><a href="#" className="hover:text-emerald-700 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-emerald-700 transition-colors">Data Sources</a></li>
              <li><a href="#" className="hover:text-emerald-700 transition-colors">Model Architecture</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors">
                <Github className="w-5 h-5 text-zinc-600" />
              </a>
              <a href="#" className="p-2 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors">
                <FileText className="w-5 h-5 text-zinc-600" />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-100 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          <p>© 2026 CropYield AI. All rights reserved.</p>
          {/* <p>Built with Google AI Studio</p> */}
        </div>
      </footer>
    </div>
  );
}
