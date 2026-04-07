import React, { useState } from 'react';
import { predictCropYield, PredictionInput } from '../services/gemini';
import { Loader2, Sprout, TrendingUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AREAS = ['Afghanistan', 'Brazil', 'Somalia', 'Uganda', 'Philippines', 'Lebanon', 'India', 'USA', 'China', 'France'];
const ITEMS = ['Maize', 'Potatoes', 'Wheat', 'Rice', 'Yams', 'Cassava', 'Soybeans', 'Sorghum'];

export const Predictor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ prediction: number; reasoning: string; confidence: number } | null>(null);
  const [formData, setFormData] = useState<PredictionInput>({
    year: 2024,
    rainfall: 1200,
    pesticides: 25000,
    avgTemp: 22,
    area: 'Brazil',
    item: 'Maize'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const prediction = await predictCropYield(formData);
      setResult(prediction);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-1 bg-white p-8 rounded-2xl border border-black/5 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Sprout className="w-6 h-6 text-emerald-700" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">New Prediction</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Area / Country</label>
              <select 
                className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              >
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Crop Item</label>
              <select 
                className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={formData.item}
                onChange={(e) => setFormData({ ...formData, item: e.target.value })}
              >
                {ITEMS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Year</label>
            <input 
              type="number"
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Annual Rainfall (mm)</label>
            <input 
              type="number"
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={formData.rainfall}
              onChange={(e) => setFormData({ ...formData, rainfall: parseFloat(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Pesticide Use (tonnes)</label>
            <input 
              type="number"
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={formData.pesticides}
              onChange={(e) => setFormData({ ...formData, pesticides: parseFloat(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Avg Temperature (°C)</label>
            <input 
              type="number"
              step="0.1"
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={formData.avgTemp}
              onChange={(e) => setFormData({ ...formData, avgTemp: parseFloat(e.target.value) })}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
            {loading ? 'Processing Model...' : 'Calculate Prediction'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="lg:col-span-2 space-y-6">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-emerald-900 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-emerald-300 font-bold uppercase tracking-widest text-xs mb-1">Predicted Yield</p>
                    <h3 className="text-6xl font-black tracking-tighter">
                      {result.prediction.toLocaleString()}
                      <span className="text-xl font-normal text-emerald-300 ml-2">hg/ha</span>
                    </h3>
                  </div>
                  <div className="bg-emerald-800/50 p-4 rounded-2xl backdrop-blur-sm border border-emerald-700">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">Confidence</p>
                    <p className="text-2xl font-mono font-bold">{(result.confidence * 100).toFixed(1)}%</p>
                  </div>
                </div>

                <div className="space-y-4 bg-emerald-800/30 p-6 rounded-2xl border border-emerald-700/50">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-emerald-400 shrink-0" />
                    <p className="text-emerald-50 leading-relaxed font-medium italic">
                      "{result.reasoning}"
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-xl bg-emerald-800/20">
                    <p className="text-[10px] uppercase tracking-wider text-emerald-400">Crop</p>
                    <p className="font-bold">{formData.item}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-emerald-800/20">
                    <p className="text-[10px] uppercase tracking-wider text-emerald-400">Region</p>
                    <p className="font-bold">{formData.area}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-emerald-800/20">
                    <p className="text-[10px] uppercase tracking-wider text-emerald-400">Year</p>
                    <p className="font-bold">{formData.year}</p>
                  </div>
                </div>
              </div>

              {/* Decorative background elements */}
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
              <div className="absolute -left-20 -top-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-zinc-100/50 border-2 border-dashed border-zinc-200 rounded-3xl p-12 text-center">
              <div className="w-20 h-20 bg-zinc-200 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-10 h-10 text-zinc-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-500 mb-2">Ready for Analysis</h3>
              <p className="text-zinc-400 max-w-xs">
                Enter the agricultural parameters and click calculate to see the predicted crop yield.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
