const variants = {
  primary: 'bg-accent-primary text-white hover:bg-accent-hover',
  secondary: 'bg-dark-card text-gray-400 border border-dark-border hover:text-white hover:border-gray-600',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent hover:bg-dark-card text-gray-400 border border-dark-border hover:text-white hover:border-gray-600'
};

const Button = ({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = size === 'sm' ? 'px-3 py-2 text-sm' : 'px-5 py-2.5';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClasses} rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
