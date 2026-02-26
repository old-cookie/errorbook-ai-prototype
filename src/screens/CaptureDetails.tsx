import { useState } from 'react';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { EriBubble } from '../components/EriBubble';
import { Toast } from '../components/Toast';
import { ChevronLeft, Save, Tag } from 'lucide-react';
import { topics } from '../data/mistakeData';
import { motion } from 'motion/react';

interface CaptureDetailsProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
  onEriClick: () => void;
}

export function CaptureDetails({ onNavigate, onBack, onEriClick }: CaptureDetailsProps) {
  const [question, setQuestion] = useState('');
  const [myAnswer, setMyAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Fractions');
  const [exam, setExam] = useState('GCSE Math');
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setShowToast(true);
    }, 1000);
  };
  
  const handleDiagnose = () => {
    const newMistake = {
      id: Date.now().toString(),
      question,
      myAnswer,
      correctAnswer,
      topic: selectedTopic,
      errorType: 'Calculation slip',
      explanation: 'You added the numerators and denominators directly instead of finding a common denominator first. Remember: find the LCM of denominators, convert both fractions, then add.',
      dueDate: 'Due today',
      exam
    };
    setShowToast(false);
    onNavigate('mistake-detail', newMistake);
  };
  
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
          <h1 className="text-2xl font-bold text-gray-900">Mistake Details</h1>
        </div>
      </div>
      
      <div className="px-6 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Question */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Calculate 3/4 + 2/5"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5CE7] focus:outline-none resize-none"
              rows={3}
            />
          </div>
          
          {/* My Answer */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              My Answer
            </label>
            <input
              type="text"
              value={myAnswer}
              onChange={(e) => setMyAnswer(e.target.value)}
              placeholder="What did you write?"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5CE7] focus:outline-none"
            />
          </div>
          
          {/* Correct Answer */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Correct Answer
            </label>
            <input
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder="The right solution"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5CE7] focus:outline-none"
            />
          </div>
          
          {/* Topic Tags */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
              <Tag size={18} className="text-[#6C5CE7]" />
              Topic
            </label>
            <div className="flex flex-wrap gap-2">
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
          
          {/* Exam */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Exam
            </label>
            <input
              type="text"
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              placeholder="e.g., GCSE Math"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5CE7] focus:outline-none"
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-4"
        >
          <Button
            onClick={handleSave}
            size="lg"
            fullWidth
            disabled={saving || !question || !myAnswer || !correctAnswer}
            icon={<Save size={20} />}
          >
            {saving ? 'Saving...' : 'Save Mistake'}
          </Button>
        </motion.div>
      </div>
      
      {/* Eri Bubble */}
      <EriBubble state="listening" onClick={onEriClick} />
      
      {/* Success Toast */}
      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message="Mistake saved!"
        action={{
          label: 'View',
          onClick: handleDiagnose
        }}
        duration={4000}
      />
    </div>
  );
}
