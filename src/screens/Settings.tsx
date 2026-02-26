import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { ChevronLeft, Share2, Type, Zap, Download, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { getAppSettings, updateAppSettings } from '../data/appState';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const [sharingEnabled, setSharingEnabled] = useState(true);
  const [textSize, setTextSize] = useState('medium');
  const [reduceMotion, setReduceMotion] = useState(getAppSettings().reduceMotion);
  const [showEri, setShowEri] = useState(getAppSettings().showEri);

  useEffect(() => {
    updateAppSettings({ reduceMotion, showEri });
  }, [reduceMotion, showEri]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors -ml-2"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>
      
      <div className="px-6 py-6 space-y-6">
        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Share2 size={20} className="text-[#6C5CE7]" />
            <h3 className="text-lg font-bold text-gray-900">Privacy</h3>
          </div>
          
          <Card padding="md">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900">Enable Sharing</p>
                <p className="text-sm text-gray-600 mt-1">
                  Allow sharing achievements and progress
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={sharingEnabled}
                  onChange={(e) => setSharingEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#6C5CE7]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C5CE7]" />
              </label>
            </div>
          </Card>
        </motion.div>
        
        {/* Accessibility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Type size={20} className="text-[#6C5CE7]" />
            <h3 className="text-lg font-bold text-gray-900">Accessibility</h3>
          </div>
          
          <div className="space-y-3">
            <Card padding="md">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Text Size</p>
                  <p className="text-sm text-gray-600 mt-1">Adjust reading comfort</p>
                </div>
                <select
                  value={textSize}
                  onChange={(e) => setTextSize(e.target.value)}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#6C5CE7] focus:outline-none text-gray-900"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </Card>
            
            <Card padding="md">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Reduce Motion</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Minimize animations and transitions
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={reduceMotion}
                    onChange={(e) => setReduceMotion(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#6C5CE7]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C5CE7]" />
                </label>
              </div>
            </Card>
          </div>
        </motion.div>
        
        {/* AI Assistant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap size={20} className="text-[#6C5CE7]" />
            <h3 className="text-lg font-bold text-gray-900">AI Assistant</h3>
          </div>
          
          <Card padding="md">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900">Show Eri Assistant</p>
                <p className="text-sm text-gray-600 mt-1">
                  Display AI coach bubble and tips
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={showEri}
                  onChange={(e) => setShowEri(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#6C5CE7]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C5CE7]" />
              </label>
            </div>
          </Card>
        </motion.div>
        
        {/* Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Download size={20} className="text-[#6C5CE7]" />
            <h3 className="text-lg font-bold text-gray-900">Data</h3>
          </div>
          
          <Card padding="md">
            <button className="w-full flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                  <Download size={20} className="text-gray-700" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Export My Data</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Download all your mistakes and progress
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </Card>
        </motion.div>
        
        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center text-gray-500 text-sm space-y-1">
            <p className="font-semibold text-gray-900">ErrorBook AI</p>
            <p>Version 1.0.0 (Demo)</p>
            <p className="text-xs mt-2">
              This is a demonstration prototype for educational purposes
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
