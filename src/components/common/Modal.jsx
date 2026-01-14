const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Glassmorphic Background overlay with blur */}
        <div
          className="fixed inset-0 transition-all duration-300 bg-gray-900/40 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className={`inline-block align-bottom bg-white/95 backdrop-blur-md rounded-2xl text-left overflow-hidden shadow-strong transform transition-all duration-300 sm:my-8 sm:align-middle ${sizeClasses[size]} w-full border border-gray-200 animate-scale-in`}>
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900 font-display">{title}</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/80 hover:bg-white text-gray-500 hover:text-gray-700 transition-all duration-300 flex items-center justify-center shadow-soft hover:shadow-medium hover:scale-110"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 bg-white/90 backdrop-blur-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
