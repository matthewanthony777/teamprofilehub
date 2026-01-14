const variants = {
  primary: 'bg-gradient-primary text-white hover:shadow-glow hover:scale-105',
  secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-glow-purple',
  ghost: 'bg-transparent hover:bg-gradient-card text-gray-700 border-2 border-gray-200 hover:border-primary-300'
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
      className={`${sizeClasses} rounded-xl font-semibold transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
