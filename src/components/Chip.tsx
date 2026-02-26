interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'selected' | 'error' | 'success';
  onClick?: () => void;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

export function Chip({
  children,
  variant = 'default',
  onClick,
  icon,
  removable,
  onRemove
}: ChipProps) {
  const variantStyles = {
    default: "bg-gray-100 text-gray-700 border-gray-200",
    selected: "bg-[#6C5CE7]/10 text-[#6C5CE7] border-[#6C5CE7]/30",
    error: "bg-red-50 text-red-600 border-red-200",
    success: "bg-green-50 text-green-600 border-green-200"
  };
  
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border ${
        variantStyles[variant]
      } ${onClick ? 'cursor-pointer hover:opacity-80' : ''} transition-all`}
    >
      {icon && <span className="text-current">{icon}</span>}
      <span>{children}</span>
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 text-current opacity-60 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
}
