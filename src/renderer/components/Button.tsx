import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  glow?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  glow = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-2 rounded-xl font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20",
    secondary: "glass-panel text-[var(--app-text)] hover:bg-[var(--card-border)]/50",
    danger: "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-400 hover:to-red-500 shadow-lg shadow-rose-500/20",
  };

  const glowStyles = glow ? "hover:shadow-[0_0_20px_-5px_rgba(34,211,238,0.6)]" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
