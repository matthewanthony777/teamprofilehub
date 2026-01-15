const EmployeeCard = ({ employee, onClick }) => {
  // Get initials from name
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '??';
    return name
      .split(' ')
      .map(part => part && part[0])
      .filter(Boolean)
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??';
  };

  return (
    <div
      onClick={onClick}
      className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-accent-primary transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar Circle */}
        <div className="w-12 h-12 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-accent-primary font-semibold text-base flex-shrink-0">
          {getInitials(employee?.name)}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white mb-1 truncate group-hover:text-accent-primary transition-all">
            {employee?.name || 'Unnamed'}
          </h3>
          <p className="text-sm text-gray-400 font-medium mb-0.5">{employee?.role || 'No role'}</p>
          <p className="text-xs text-gray-500">{employee?.department || 'No department'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-dark-border">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <span className="font-medium">
            {(employee?.skills || []).length} skill{(employee?.skills || []).length !== 1 ? 's' : ''}
          </span>
        </div>

        <span className="text-gray-400 font-medium text-sm flex items-center gap-1 group-hover:text-accent-primary group-hover:gap-2 transition-all">
          View
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default EmployeeCard;
