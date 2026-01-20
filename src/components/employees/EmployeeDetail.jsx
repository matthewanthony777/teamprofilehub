import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { VIEWS, TIMELINE_STATUS_COLORS } from '../../constants';
import { calculateOverlaps, formatDateRange, calculateDuration, migrateTimelineEntry } from '../../utils/timeline';
import PageLayout from '../PageLayout';
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
      <div className="text-center py-12 bg-dark-surface border border-dark-border rounded-xl">
        <p className="text-gray-500 mb-4">No employee selected</p>
        <Button onClick={() => setCurrentView(VIEWS.EMPLOYEES)}>
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

  const getSkillName = (skillId, storedName = null) => {
    // First try to find by ID in the skills catalog
    if (skills && Array.isArray(skills)) {
      const skill = skills.find((s) => s && s.id === skillId);
      if (skill) return skill.name;
    }
    // Fallback to stored name if ID lookup fails (cross-device compatibility)
    if (storedName) return storedName;
    return 'Unknown';
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
    <PageLayout
      title={selectedEmployee.name}
      description={`${selectedEmployee.role} • ${selectedEmployee.department}`}
      actions={
        <>
          <Button variant="ghost" onClick={() => setCurrentView(VIEWS.EMPLOYEES)}>
            ← Back
          </Button>
          <Button variant="secondary" onClick={handleEdit}>Edit</Button>
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
            Delete
          </Button>
        </>
      }
    >
      {/* Profile Overview Card */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <div className="flex items-start gap-6 mb-6">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-accent-primary font-semibold text-xl flex-shrink-0">
            {getInitials(selectedEmployee.name)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-white mb-2">
              {selectedEmployee.name}
            </h2>
            <p className="text-base text-gray-400 mb-1">{selectedEmployee.role}</p>
            <p className="text-sm text-gray-500">{selectedEmployee.department}</p>
          </div>
        </div>

        <div className="space-y-6">{/* Content sections will follow */}

          {/* About Me Section */}
          {selectedEmployee.aboutMe && (
            <div>
              <h3 className="text-base font-semibold text-white mb-3">About Me</h3>
              <p className="text-sm text-gray-400 leading-relaxed bg-dark-card border border-dark-border p-4 rounded-lg">
                {selectedEmployee.aboutMe}
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-dark-card border border-dark-border p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Department</h3>
              </div>
              <p className="text-sm font-medium text-white">{selectedEmployee.department}</p>
            </div>

            <div className="bg-dark-card border border-dark-border p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</h3>
              </div>
              <p className="text-sm font-medium">
                <a href={`mailto:${selectedEmployee.email}`} className="text-accent-primary hover:text-accent-hover hover:underline">
                  {selectedEmployee.email}
                </a>
              </p>
            </div>

            {selectedEmployee.phone && (
              <div className="bg-dark-card border border-dark-border p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</h3>
                </div>
                <p className="text-sm font-medium">
                  <a href={`tel:${selectedEmployee.phone}`} className="text-accent-primary hover:text-accent-hover hover:underline">
                    {selectedEmployee.phone}
                  </a>
                </p>
              </div>
            )}

            {selectedEmployee.location && (
              <div className="bg-dark-card border border-dark-border p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</h3>
                </div>
                <p className="text-sm font-medium text-white">{selectedEmployee.location}</p>
              </div>
            )}

            <div className="bg-dark-card border border-dark-border p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Hire Date</h3>
              </div>
              <p className="text-sm font-medium text-white">
                {selectedEmployee?.hireDate ? new Date(selectedEmployee.hireDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">
          Skills ({(selectedEmployee.skills || []).length})
        </h3>
        {(selectedEmployee.skills || []).length === 0 ? (
          <p className="text-gray-500 text-sm italic">No skills assigned</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(selectedEmployee.skills || []).map((empSkill) => (
              <SkillBadge
                key={empSkill.skillId}
                skillName={getSkillName(empSkill.skillId, empSkill.skillName)}
                proficiencyLevel={empSkill.proficiencyLevel}
              />
            ))}
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">
          Education ({(selectedEmployee.education || []).length})
        </h3>
        {(selectedEmployee.education || []).length === 0 ? (
          <p className="text-gray-500 text-sm italic">No education entries</p>
        ) : (
          <div className="space-y-3">
            {(selectedEmployee.education || []).map((edu) => {
              // Support both old structure (educationId) and new structure (inline data)
              if (edu.educationId) {
                // Old structure - fetch from global catalog
                const eduDetails = getEducationDetails(edu.educationId);
                if (!eduDetails) return null;
                return (
                  <div key={edu.educationId} className="p-4 bg-dark-card border border-dark-border rounded-lg hover:border-accent-primary transition-all">
                    <div className="font-semibold text-white text-base mb-1">{eduDetails.degree}</div>
                    <div className="text-sm text-gray-400 font-medium mb-1">{eduDetails.field}</div>
                    <div className="text-sm text-gray-500 mb-3">{eduDetails.institution}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-gray-400 bg-dark-surface px-3 py-1 rounded-full border border-dark-border">
                        {eduDetails.year}
                      </span>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent-primary text-white">
                        {eduDetails.category}
                      </span>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${eduDetails.status === 'Completed' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}`}>
                        {eduDetails.status}
                      </span>
                    </div>
                  </div>
                );
              } else {
                // New structure - inline education data
                return (
                  <div key={edu.id} className="p-4 bg-dark-card border border-dark-border rounded-lg hover:border-accent-primary transition-all">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <EducationBadge level={edu.level} size="sm" />
                      <span className="font-semibold text-white text-base">{edu.institution}</span>
                    </div>
                    <div className="text-sm text-gray-400 font-medium mb-1">{edu.subject}</div>
                    <div className="flex items-center gap-2 flex-wrap text-xs mt-3">
                      {edu.yearCompleted && (
                        <span className="px-3 py-1 bg-dark-surface text-gray-400 rounded-full font-medium border border-dark-border">
                          {edu.yearCompleted}
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full font-medium ${
                        edu.status === 'Completed'
                          ? 'bg-green-600 text-white'
                          : edu.status === 'In Progress'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-gray-600 text-white'
                      }`}>
                        {edu.status}
                      </span>
                      {edu.grade && (
                        <span className="px-3 py-1 bg-accent-primary text-white rounded-full font-medium">
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
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-white">
              Career Timeline ({sortedTimeline.length})
            </h3>
            {sortedTimeline.some(e => e && e.id && timelineOverlaps[e.id]?.count > 0) && (
              <span className="text-xs font-medium text-yellow-400 bg-yellow-900/30 px-3 py-1 rounded-full border border-yellow-800/50">
                🔄 Concurrent projects
              </span>
            )}
          </div>
          <div className="relative pl-8">
            {/* Vertical Line */}
            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-dark-border"></div>

            <div className="space-y-6">
              {sortedTimeline.map((entry, index) => {
                if (!entry || !entry.id) return null;
                const overlap = timelineOverlaps[entry.id];
                const duration = calculateDuration(entry.startDate, entry.endDate);

                return (
                  <div key={entry.id} className="relative">
                    {/* Timeline Node */}
                    <div className={`absolute -left-[26px] top-2 w-4 h-4 rounded-full border-2 ${
                      entry.status === 'Completed' ? 'bg-green-600 border-green-500' :
                      entry.status === 'In Progress' ? 'bg-accent-primary border-accent-primary' :
                      'bg-gray-600 border-gray-500'
                    } z-10`}></div>

                    {/* Timeline Content */}
                    <div className="bg-dark-card border border-dark-border rounded-lg p-4 hover:border-accent-primary transition-all">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="text-sm text-gray-400 mb-1">
                            {formatDateRange(entry.startDate, entry.endDate)} • {duration} month{duration > 1 ? 's' : ''}
                          </div>
                          <div className="text-base font-semibold text-white mb-1">{entry.title}</div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          entry.status === 'Completed' ? 'bg-green-600 text-white' :
                          entry.status === 'In Progress' ? 'bg-accent-primary text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {entry.status}
                        </span>
                      </div>

                      {/* Overlap Indicator */}
                      {overlap && overlap.count > 0 && (
                        <div className="mb-2 p-2 bg-yellow-900/30 border border-yellow-800/50 rounded">
                          <span className="text-xs text-yellow-400">
                            🔄 Concurrent with {overlap.count} other project{overlap.count > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}

                      {/* Description */}
                      <div className="text-sm text-gray-400 mb-2">{entry.description}</div>

                      {/* Tags */}
                      {entry.tags && Array.isArray(entry.tags) && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map((tag, tagIndex) => (
                            <span
                              key={`${entry.id}-tag-${tagIndex}`}
                              className="px-2 py-1 bg-dark-surface text-gray-400 rounded text-xs font-medium border border-dark-border"
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
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h3 className="text-base font-semibold text-white mb-3">Career Next Steps</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            {selectedEmployee.careerNextSteps}
          </p>
        </div>
      )}

      {/* Previous Experience Section */}
      {selectedEmployee.previousExperience && (
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h3 className="text-base font-semibold text-white mb-3">Previous Experience</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            {selectedEmployee.previousExperience}
          </p>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${selectedEmployee.name}? This action cannot be undone.`}
      />
    </PageLayout>
  );
};

export default EmployeeDetail;
