const Select = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  error,
  placeholder = 'Select...',
  className = ''
}) => {
  return (
    <div className={`${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-2.5 bg-[#0a0a0a] border rounded-lg text-white transition-all duration-200 focus:outline-none appearance-none cursor-pointer ${
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-[#2a2a2a] focus:border-[#3b82f6] hover:border-[#3a3a3a]'
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem'
        }}
      >
        <option value="" className="bg-[#0a0a0a] text-gray-400">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#0a0a0a] text-white">
            {option}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
