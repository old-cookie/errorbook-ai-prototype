import { Home, Camera, BookOpen, TrendingUp } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'capture' | 'review' | 'progress';
  onTabChange: (tab: 'home' | 'capture' | 'review' | 'progress') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'capture' as const, icon: Camera, label: 'Capture' },
    { id: 'review' as const, icon: BookOpen, label: 'Review' },
    { id: 'progress' as const, icon: TrendingUp, label: 'Progress' }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2 max-w-5xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-[#6C5CE7] bg-[#6C5CE7]/5'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={24} strokeWidth={2} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
