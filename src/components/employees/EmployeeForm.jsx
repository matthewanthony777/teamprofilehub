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
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleCancel}>
          ← Back
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
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
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@sqc.com"
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

          {/* About Me */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
            <div>
              <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700 mb-1">
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.aboutMe ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.aboutMe && <p className="text-sm text-red-600">{errors.aboutMe}</p>}
                <p className="text-xs text-gray-500 ml-auto">{formData.aboutMe.length}/500</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
            <SkillSelector selectedSkills={formData.skills} onChange={handleSkillsChange} />
          </div>

          {/* Education */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
            <EducationSelector selectedEducation={formData.education} onChange={handleEducationChange} />
          </div>

          {/* Career Timeline */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Timeline</h3>

            {sortedTimeline.length > 0 && (
              <div className="space-y-3 mb-4">
                {sortedTimeline.map((entry) => (
                  <div key={entry.id} className="p-4 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-sm text-gray-600">{entry.period}</div>
                        <div className="font-medium text-gray-900 mt-1">{entry.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{entry.description}</div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          type="button"
                          onClick={() => handleEditTimelineEntry(entry)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTimelineEntry(entry.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              variant="ghost"
              onClick={() => setShowTimelineForm(true)}
              type="button"
              size="sm"
            >
              + Add Timeline Entry
            </Button>
          </div>

          {/* Career Next Steps */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Next Steps</h3>
            <div>
              <label htmlFor="careerNextSteps" className="block text-sm font-medium text-gray-700 mb-1">
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.careerNextSteps ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.careerNextSteps && <p className="text-sm text-red-600">{errors.careerNextSteps}</p>}
                <p className="text-xs text-gray-500 ml-auto">{formData.careerNextSteps.length}/300</p>
              </div>
            </div>
          </div>

          {/* Previous Experience */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Experience</h3>
            <div>
              <label htmlFor="previousExperience" className="block text-sm font-medium text-gray-700 mb-1">
                What did you do before joining SQC? (max 300 characters)
              </label>
              <textarea
                id="previousExperience"
                name="previousExperience"
                value={formData.previousExperience}
                onChange={handleChange}
                placeholder="Describe your previous roles and companies..."
                rows={3}
                maxLength={300}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.previousExperience ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.previousExperience && <p className="text-sm text-red-600">{errors.previousExperience}</p>}
                <p className="text-xs text-gray-500 ml-auto">{formData.previousExperience.length}/300</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button variant="secondary" onClick={handleCancel} type="button">
              Cancel
            </Button>
            <Button type="submit">{selectedEmployee ? 'Update' : 'Add'} Employee</Button>
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
