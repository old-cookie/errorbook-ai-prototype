import { Card } from '../components/Card';
import { Camera, Edit3, Upload, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface CaptureProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export function Capture({ onNavigate, onBack }: CaptureProps) {
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
          <h1 className="text-2xl font-bold text-gray-900">Add Mistake</h1>
        </div>
      </div>
      
      <div className="px-6 py-8 space-y-6">
        <div className="text-center mb-8">
          <p className="text-gray-600">Choose how to capture your mistake</p>
        </div>
        
        {/* Camera Mock */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl overflow-hidden border-4 border-gray-400 mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Camera size={64} className="text-gray-500 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Camera viewfinder</p>
                <p className="text-gray-500 text-sm">(Demo only)</p>
              </div>
            </div>
            
            {/* Crosshair overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-white/50 rounded-2xl" />
            </div>
          </div>
        </motion.div>
        
        {/* Capture Options */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              onClick={() => onNavigate('capture-details')}
              padding="md"
              className="border-2 border-[#6C5CE7]"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#6C5CE7]/10 rounded-xl">
                  <Camera size={24} className="text-[#6C5CE7]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Take Photo</p>
                  <p className="text-sm text-gray-600">Capture from your worksheet</p>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              onClick={() => onNavigate('capture-details')}
              padding="md"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <Edit3 size={24} className="text-gray-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Manual Input</p>
                  <p className="text-sm text-gray-600">Type it yourself</p>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card
              onClick={() => onNavigate('capture-details')}
              padding="md"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <Upload size={24} className="text-gray-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Import Screenshot</p>
                  <p className="text-sm text-gray-600">From your gallery</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
