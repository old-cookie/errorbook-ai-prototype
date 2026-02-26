import { useState } from 'react';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { AlertCircle, Filter } from 'lucide-react';
import { mistakeData, topics, errorTypes } from '../data/mistakeData';
import { motion } from 'motion/react';

interface ReviewProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function Review({ onNavigate }: ReviewProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedErrorType, setSelectedErrorType] = useState<string | null>(null);
  const [showDueOnly, setShowDueOnly] = useState(false);
  
  const filteredMistakes = mistakeData.filter((mistake) => {
    if (selectedTopic && mistake.topic !== selectedTopic) return false;
    if (selectedErrorType && mistake.errorType !== selectedErrorType) return false;
    if (showDueOnly && mistake.dueDate !== 'Due today') return false;
    return true;
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Review</h1>
        <p className="text-gray-600 text-sm mt-1">{filteredMistakes.length} mistake cards</p>
      </div>
      
      <div className="px-6 py-6 space-y-6">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-[#6C5CE7]" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>
          
          <div className="space-y-3">
            {/* Topic Filter */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Topic</p>
              <div className="flex flex-wrap gap-2">
                <Chip
                  variant={selectedTopic === null ? 'selected' : 'default'}
                  onClick={() => setSelectedTopic(null)}
                >
                  All
                </Chip>
                {topics.map((topic) => (
                  <Chip
                    key={topic}
                    variant={selectedTopic === topic ? 'selected' : 'default'}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    {topic}
                  </Chip>
                ))}
              </div>
            </div>
            
            {/* Error Type Filter */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Error Type</p>
              <div className="flex flex-wrap gap-2">
                <Chip
                  variant={selectedErrorType === null ? 'selected' : 'default'}
                  onClick={() => setSelectedErrorType(null)}
                >
                  All
                </Chip>
                {errorTypes.slice(0, 3).map((type) => (
                  <Chip
                    key={type}
                    variant={selectedErrorType === type ? 'selected' : 'default'}
                    onClick={() => setSelectedErrorType(type)}
                  >
                    {type}
                  </Chip>
                ))}
              </div>
            </div>
            
            {/* Due Today Toggle */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDueOnly}
                  onChange={(e) => setShowDueOnly(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-gray-300 text-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
                />
                <span className="text-gray-700 font-medium">Show only due today</span>
              </label>
            </div>
          </div>
        </motion.div>
        
        {/* Mistake List */}
        <div className="space-y-3">
          {filteredMistakes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No mistakes match your filters</p>
            </div>
          ) : (
            filteredMistakes.map((mistake, index) => (
              <motion.div
                key={mistake.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card onClick={() => onNavigate('mistake-detail', mistake)} padding="md">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      mistake.dueDate === 'Due today' ? 'bg-red-50' : 'bg-gray-100'
                    }`}>
                      <AlertCircle size={20} className={
                        mistake.dueDate === 'Due today' ? 'text-red-500' : 'text-gray-500'
                      } />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {mistake.question}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Chip variant="default">{mistake.topic}</Chip>
                        <Chip variant="default">{mistake.errorType}</Chip>
                      </div>
                      <p className={`text-sm font-medium ${
                        mistake.dueDate === 'Due today' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {mistake.dueDate}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
