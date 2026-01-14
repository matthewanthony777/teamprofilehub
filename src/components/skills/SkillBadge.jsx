const SkillBadge = ({ skillName, proficiencyLevel, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2';

  // Gradient styles with different directions for visual variety
  const proficiencyStyles = {
    Beginner: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
    Intermediate: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
    Advanced: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
    Expert: 'bg-gradient-to-bl from-purple-500 to-primary-600 text-white'
  };

  const style = proficiencyStyles[proficiencyLevel] || proficiencyStyles.Beginner;

  return (
    <span
      className={`inline-block rounded-full font-medium shadow-soft hover:shadow-medium hover:scale-105 transition-all duration-300 ${sizeClasses} ${style}`}
    >
      {skillName} {proficiencyLevel && `(${proficiencyLevel})`}
    </span>
  );
};

export default SkillBadge;
