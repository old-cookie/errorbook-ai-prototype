interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ children, onClick, className = '', padding = 'md' }: CardProps) {
  const paddingStyles = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
  
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${
        paddingStyles[padding]
      } ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : ''} transition-all ${className}`}
    >
      {children}
    </div>
  );
}
