import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { VIEWS, TIMELINE_STATUS_COLORS } from '../../constants';
import { calculateOverlaps, formatDateRange, calculateDuration, migrateTimelineEntry } from '../../utils/timeline';
import Button from '../common/Button';
import SkillBadge from '../skills/SkillBadge';
import EducationBadge from '../education/EducationBadge';
import ConfirmDialog from '../common/ConfirmDialog';

const EmployeeDetail = () => {
  const { selectedEmployee, skills, education, setCurrentView, deleteEmployee, setSelectedEmployee } =
    useContext(AppContext);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!selectedEmployee) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No employee selected</p>
        <Button onClick={() => setCurrentView(VIEWS.EMPLOYEES)} className="mt-4">
          Back to Employees
        </Button>
      </div>
    );
  }

  const handleEdit = () => {
    setCurrentView(VIEWS.EMPLOYEE_FORM);
  };

  const handleDelete = () => {
    deleteEmployee(selectedEmployee.id);
    setSelectedEmployee(null);
    setCurrentView(VIEWS.EMPLOYEES);
  };

  const getSkillName = (skillId) => {
    if (!skills || !Array.isArray(skills)) return 'Unknown';
    const skill = skills.find((s) => s && s.id === skillId);
    return skill ? skill.name : 'Unknown';
  };

  const getEducationDetails = (educationId) => {
    if (!education || !Array.isArray(education)) return null;
    const edu = education.find((e) => e && e.id === educationId);
    return edu || null;
  };

  // Migrate and sort timeline entries by start date (most recent first)
  const migratedTimeline = (selectedEmployee?.careerTimeline || [])
    .map(migrateTimelineEntry)
    .filter(entry => entry !== null); // Remove null entries from migration

  const sortedTimeline = [...migratedTimeline].sort((a, b) => {
    const dateA = new Date(a?.startDate || '1970-01-01');
    const dateB = new Date(b?.startDate || '1970-01-01');
    return dateB - dateA;
  });

  // Calculate overlaps for all timeline entries
  const timelineOverlaps = calculateOverlaps(migratedTimeline) || {};

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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setCurrentView(VIEWS.EMPLOYEES)}>
          ← Back
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-medium border border-gray-100 overflow-hidden">
        {/* Header with Avatar */}
        <div className="bg-gradient-to-br from-primary-50 to-purple-50 p-8 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
            <div className="flex items-start gap-6">
              {/* Avatar Circle */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-strong">
                {getInitials(selectedEmployee.name)}
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900 font-display mb-2">
                  {selectedEmployee.name}
                </h2>
                <p className="text-xl text-gray-600 font-medium">{selectedEmployee.role}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleEdit}>Edit</Button>
              <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">{/* Content sections will follow */}

          {/* About Me Section */}
          {selectedEmployee.aboutMe && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-900 font-display">About Me</h3>
              </div>
              <p className="text-gray-700 leading-relaxed bg-gradient-to-br from-primary-50/50 to-purple-50/50 p-4 rounded-xl border border-primary-100">
                {selectedEmployee.aboutMe}
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Department</h3>
              </div>
              <p className="text-lg font-medium text-gray-900">{selectedEmployee.department}</p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</h3>
              </div>
              <p className="text-lg font-medium">
                <a href={`mailto:${selectedEmployee.email}`} className="text-primary-600 hover:text-primary-700 hover:underline">
                  {selectedEmployee.email}
                </a>
              </p>
            </div>

            {selectedEmployee.phone && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Phone</h3>
                </div>
                <p className="text-lg font-medium">
                  <a href={`tel:${selectedEmployee.phone}`} className="text-primary-600 hover:text-primary-700 hover:underline">
                    {selectedEmployee.phone}
                  </a>
                </p>
              </div>
            )}

            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Hire Date</h3>
              </div>
              <p className="text-lg font-medium text-gray-900">
                {selectedEmployee?.hireDate ? new Date(selectedEmployee.hireDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <h3 className="text-lg font-bold text-gray-900 font-display">
                Skills ({(selectedEmployee.skills || []).length})
              </h3>
            </div>
            {(selectedEmployee.skills || []).length === 0 ? (
              <p className="text-gray-500 italic">No skills assigned</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(selectedEmployee.skills || []).map((empSkill) => (
                  <SkillBadge
                    key={empSkill.skillId}
                    skillName={getSkillName(empSkill.skillId)}
                    proficiencyLevel={empSkill.proficiencyLevel}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Education Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              <h3 className="text-lg font-bold text-gray-900 font-display">
                Education ({(selectedEmployee.education || []).length})
              </h3>
            </div>
            {(selectedEmployee.education || []).length === 0 ? (
              <p className="text-gray-500 italic">No education entries</p>
            ) : (
              <div className="space-y-3">
                {(selectedEmployee.education || []).map((edu) => {
                  // Support both old structure (educationId) and new structure (inline data)
                  if (edu.educationId) {
                    // Old structure - fetch from global catalog
                    const eduDetails = getEducationDetails(edu.educationId);
                    if (!eduDetails) return null;
                    return (
                      <div key={edu.educationId} className="p-4 bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-xl border border-amber-200 hover:shadow-medium transition-all duration-300">
                        <div className="font-bold text-gray-900 text-lg mb-1">{eduDetails.degree}</div>
                        <div className="text-sm text-gray-600 font-medium mb-1">{eduDetails.field}</div>
                        <div className="text-sm text-gray-600 mb-3">{eduDetails.institution}</div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium text-gray-600 bg-white px-3 py-1 rounded-full shadow-soft">
                            {eduDetails.year}
                          </span>
                          <span className="text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-soft">
                            {eduDetails.category}
                          </span>
                          <span className={`text-xs font-medium px-3 py-1 rounded-full shadow-soft ${eduDetails.status === 'Completed' ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'}`}>
                            {eduDetails.status}
                          </span>
                        </div>
                      </div>
                    );
                  } else {
                    // New structure - inline education data
                    return (
                      <div key={edu.id} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 hover:shadow-medium transition-all duration-300">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <EducationBadge level={edu.level} size="sm" />
                          <span className="font-bold text-gray-900 text-lg">{edu.institution}</span>
                        </div>
                        <div className="text-sm text-gray-700 font-medium mb-1">{edu.subject}</div>
                        <div className="flex items-center gap-2 flex-wrap text-xs mt-3">
                          {edu.yearCompleted && (
                            <span className="px-3 py-1 bg-white text-gray-700 rounded-full shadow-soft font-medium border border-gray-200">
                              {edu.yearCompleted}
                            </span>
                          )}
                          <span className={`px-3 py-1 rounded-full font-medium shadow-soft ${
                            edu.status === 'Completed'
                              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                              : edu.status === 'In Progress'
                              ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                              : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                          }`}>
                            {edu.status}
                          </span>
                          {edu.grade && (
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-medium shadow-soft">
                              {edu.grade}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>

          {/* Career Timeline Section */}
          {sortedTimeline.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-900 font-display">
                    Career Timeline ({sortedTimeline.length})
                  </h3>
                </div>
                {sortedTimeline.some(e => e && e.id && timelineOverlaps[e.id]?.count > 0) && (
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    🔄 Contains concurrent projects
                  </span>
                )}
              </div>
              <div className="relative pl-10">
                {/* Gradient Vertical Line */}
                <div className="absolute left-3 top-2 bottom-2 w-1 timeline-line rounded-full"></div>

                <div className="space-y-8">
                  {sortedTimeline.map((entry, index) => {
                    if (!entry || !entry.id) return null; // Skip invalid entries
                    const overlap = timelineOverlaps[entry.id];
                    const statusColor = TIMELINE_STATUS_COLORS[entry.status] || TIMELINE_STATUS_COLORS['Completed'];
                    const duration = calculateDuration(entry.startDate, entry.endDate);

                    return (
                      <div key={entry.id} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        {/* Gradient Timeline Node with status color */}
                        <div className={`absolute -left-[30px] top-2 w-6 h-6 rounded-full ${
                          entry.status === 'Completed' ? 'timeline-node' :
                          entry.status === 'In Progress' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                          'bg-gradient-to-br from-gray-400 to-gray-600'
                        } border-4 border-white shadow-strong z-10`}></div>

                        {/* Timeline Content */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-200 card-lift">
                          {/* Header with Date Range and Status */}
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <div className="text-sm font-bold text-primary-600">
                                  {formatDateRange(entry.startDate, entry.endDate)}
                                </div>
                                <span className="text-xs text-gray-500">• {duration} month{duration > 1 ? 's' : ''}</span>
                              </div>
                              <div className="text-xl font-bold text-gray-900 mb-2 font-display">{entry.title}</div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${statusColor}`}>
                              {entry.status}
                            </span>
                          </div>

                          {/* Overlap Indicator */}
                          {overlap && overlap.count > 0 && (
                            <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                <span className="text-xs font-medium text-amber-800">
                                  🔄 Concurrent with {overlap.count} other project{overlap.count > 1 ? 's' : ''}: {(overlap.entries || []).map(e => e?.title || 'Untitled').join(', ')}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Description */}
                          <div className="text-gray-700 leading-relaxed mb-3">{entry.description}</div>

                          {/* Tags */}
                          {entry.tags && Array.isArray(entry.tags) && entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {entry.tags.map((tag, tagIndex) => (
                                <span
                                  key={`${entry.id}-tag-${tagIndex}`}
                                  className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium border border-primary-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Career Next Steps Section */}
          {selectedEmployee.careerNextSteps && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-900 font-display">Career Next Steps</h3>
              </div>
              <p className="text-gray-700 leading-relaxed bg-gradient-to-br from-blue-50/50 to-cyan-50/50 p-4 rounded-xl border border-blue-200">
                {selectedEmployee.careerNextSteps}
              </p>
            </div>
          )}

          {/* Previous Experience Section */}
          {selectedEmployee.previousExperience && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-900 font-display">Previous Experience</h3>
              </div>
              <p className="text-gray-700 leading-relaxed bg-gradient-to-br from-purple-50/50 to-pink-50/50 p-4 rounded-xl border border-purple-200">
                {selectedEmployee.previousExperience}
              </p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${selectedEmployee.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default EmployeeDetail;
