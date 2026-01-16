import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { validateEmployee } from '../../utils/validators';
import { DEPARTMENTS, VIEWS } from '../../constants';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import SkillSelector from '../skills/SkillSelector';
import EducationSelector from '../education/EducationSelector';
import TimelineEntryForm from './TimelineEntryForm';

const EmployeeForm = () => {
  const { addEmployee, updateEmployee, selectedEmployee, setSelectedEmployee, setCurrentView } =
    useContext(AppContext);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    email: '',
    hireDate: '',
    phone: '',
    location: '',
    aboutMe: '',
    careerNextSteps: '',
    previousExperience: '',
    skills: [],
    education: [],
    careerTimeline: []
  });

  const [errors, setErrors] = useState({});
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [editTimelineEntry, setEditTimelineEntry] = useState(null);

  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        ...selectedEmployee,
        skills: selectedEmployee.skills || [],
        education: selectedEmployee.education || [],
        careerTimeline: selectedEmployee.careerTimeline || [],
        location: selectedEmployee.location || '',
        aboutMe: selectedEmployee.aboutMe || '',
        careerNextSteps: selectedEmployee.careerNextSteps || '',
        previousExperience: selectedEmployee.previousExperience || ''
      });
    }
  }, [selectedEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSkillsChange = (skills) => {
    setFormData((prev) => ({ ...prev, skills }));
  };

  const handleEducationChange = (education) => {
    setFormData((prev) => ({ ...prev, education }));
  };

  const handleAddTimelineEntry = (entry) => {
    if (editTimelineEntry) {
      // Update existing entry
      const updated = formData.careerTimeline.map(e => e.id === entry.id ? entry : e);
      setFormData((prev) => ({ ...prev, careerTimeline: updated }));
      setEditTimelineEntry(null);
    } else {
      // Add new entry
      setFormData((prev) => ({ ...prev, careerTimeline: [...prev.careerTimeline, entry] }));
    }
    setShowTimelineForm(false);
  };

  const handleEditTimelineEntry = (entry) => {
    setEditTimelineEntry(entry);
    setShowTimelineForm(true);
  };

  const handleDeleteTimelineEntry = (entryId) => {
    setFormData((prev) => ({
      ...prev,
      careerTimeline: prev.careerTimeline.filter(e => e.id !== entryId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateEmployee(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (selectedEmployee) {
      updateEmployee(selectedEmployee.id, formData);
      setCurrentView(VIEWS.EMPLOYEE_DETAIL);
    } else {
      addEmployee(formData);
      setCurrentView(VIEWS.EMPLOYEES);
    }

    handleCancel();
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      role: '',
      department: '',
      email: '',
      hireDate: '',
      phone: '',
      aboutMe: '',
      careerNextSteps: '',
      previousExperience: '',
      skills: [],
      education: [],
      careerTimeline: []
    });
    setErrors({});
    setSelectedEmployee(null);
    setCurrentView(VIEWS.EMPLOYEES);
  };

  // Sort timeline entries by period (most recent first)
  const sortedTimeline = [...formData.careerTimeline].sort((a, b) => {
    return b.period.localeCompare(a.period);
  });

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleCancel}>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </span>
        </Button>
      </div>

      {/* Main Form Container */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-8">
        {/* Form Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedEmployee ? 'Update employee information' : 'Fill in the employee details below'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                error={errors.name}
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@company.com"
                required
                error={errors.email}
              />

              <Input
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Software Engineer"
                required
                error={errors.role}
              />

              <Select
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                options={DEPARTMENTS}
                required
                error={errors.department}
              />

              <Input
                label="Hire Date"
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                required
                error={errors.hireDate}
              />

              <Input
                label="Phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 555-0100"
                error={errors.phone}
              />

              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., San Francisco, CA"
                error={errors.location}
              />
            </div>
          </div>

          {/* About Me Section */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About Me
            </h3>
            <div>
              <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-400 mb-2">
                About Me (max 500 characters)
              </label>
              <textarea
                id="aboutMe"
                name="aboutMe"
                value={formData.aboutMe}
                onChange={handleChange}
                placeholder="Brief overview about yourself, your interests, and what you bring to the team..."
                rows={4}
                maxLength={500}
                className={`w-full px-4 py-2.5 bg-[#0a0a0a] border rounded-lg text-white placeholder-gray-600 focus:outline-none transition-all resize-none ${
                  errors.aboutMe ? 'border-red-500' : 'border-[#2a2a2a] focus:border-[#3b82f6] hover:border-[#3a3a3a]'
                }`}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.aboutMe && <p className="text-sm text-red-500">{errors.aboutMe}</p>}
                <p className="text-xs text-gray-500 ml-auto">{formData.aboutMe.length}/500</p>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Skills
            </h3>
            <SkillSelector selectedSkills={formData.skills} onChange={handleSkillsChange} />
          </div>

          {/* Education Section */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              Education
            </h3>
            <EducationSelector selectedEducation={formData.education} onChange={handleEducationChange} />
          </div>

          {/* Career Timeline Section */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Career Timeline
              </h3>
              <button
                type="button"
                onClick={() => setShowTimelineForm(true)}
                className="px-3 py-1.5 text-sm font-medium text-[#3b82f6] hover:text-[#2563eb] transition-all flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Entry
              </button>
            </div>

            {sortedTimeline.length > 0 ? (
              <div className="space-y-3">
                {sortedTimeline.map((entry) => (
                  <div key={entry.id} className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500">{entry.period}</div>
                        <div className="font-medium text-white mt-1">{entry.title}</div>
                        <div className="text-sm text-gray-400 mt-1">{entry.description}</div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          type="button"
                          onClick={() => handleEditTimelineEntry(entry)}
                          className="text-[#3b82f6] hover:text-[#2563eb] text-sm"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTimelineEntry(entry.id)}
                          className="text-gray-400 hover:text-red-500 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg">
                <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-500">No timeline entries yet</p>
                <button
                  type="button"
                  onClick={() => setShowTimelineForm(true)}
                  className="mt-3 text-sm text-[#3b82f6] hover:text-[#2563eb]"
                >
                  Add timeline entry
                </button>
              </div>
            )}
          </div>

          {/* Career Next Steps Section */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Career Next Steps
            </h3>
            <div>
              <label htmlFor="careerNextSteps" className="block text-sm font-medium text-gray-400 mb-2">
                What's next in your career? (max 300 characters)
              </label>
              <textarea
                id="careerNextSteps"
                name="careerNextSteps"
                value={formData.careerNextSteps}
                onChange={handleChange}
                placeholder="Describe your career goals and aspirations..."
                rows={3}
                maxLength={300}
                className={`w-full px-4 py-2.5 bg-[#0a0a0a] border rounded-lg text-white placeholder-gray-600 focus:outline-none transition-all resize-none ${
                  errors.careerNextSteps ? 'border-red-500' : 'border-[#2a2a2a] focus:border-[#3b82f6] hover:border-[#3a3a3a]'
                }`}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.careerNextSteps && <p className="text-sm text-red-500">{errors.careerNextSteps}</p>}
                <p className="text-xs text-gray-500 ml-auto">{formData.careerNextSteps.length}/300</p>
              </div>
            </div>
          </div>

          {/* Previous Experience Section */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Previous Experience
            </h3>
            <div>
              <label htmlFor="previousExperience" className="block text-sm font-medium text-gray-400 mb-2">
                What did you do before joining? (max 300 characters)
              </label>
              <textarea
                id="previousExperience"
                name="previousExperience"
                value={formData.previousExperience}
                onChange={handleChange}
                placeholder="Describe your previous roles and companies..."
                rows={3}
                maxLength={300}
                className={`w-full px-4 py-2.5 bg-[#0a0a0a] border rounded-lg text-white placeholder-gray-600 focus:outline-none transition-all resize-none ${
                  errors.previousExperience ? 'border-red-500' : 'border-[#2a2a2a] focus:border-[#3b82f6] hover:border-[#3a3a3a]'
                }`}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.previousExperience && <p className="text-sm text-red-500">{errors.previousExperience}</p>}
                <p className="text-xs text-gray-500 ml-auto">{formData.previousExperience.length}/300</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#2a2a2a]">
            <Button variant="secondary" onClick={handleCancel} type="button">
              Cancel
            </Button>
            <Button type="submit">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {selectedEmployee ? 'Update Employee' : 'Create Employee'}
              </span>
            </Button>
          </div>
        </form>
      </div>

      {/* Timeline Entry Form Modal */}
      <TimelineEntryForm
        isOpen={showTimelineForm}
        onClose={() => {
          setShowTimelineForm(false);
          setEditTimelineEntry(null);
        }}
        onAdd={handleAddTimelineEntry}
        editEntry={editTimelineEntry}
        allEntries={formData.careerTimeline}
      />
    </div>
  );
};

export default EmployeeForm;
