interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon
}: ButtonProps) {
  const baseStyles = "rounded-xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2";
  
  const variantStyles = {
    primary: "bg-[#6C5CE7] text-white shadow-lg shadow-[#6C5CE7]/20 hover:bg-[#5F4FD1] disabled:opacity-50",
    secondary: "bg-white text-[#6C5CE7] border-2 border-[#6C5CE7] hover:bg-[#6C5CE7]/5 disabled:opacity-50",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 disabled:opacity-50"
  };
  
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        fullWidth ? 'w-full' : ''
      }`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
