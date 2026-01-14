import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EDUCATION_LEVELS, EDUCATION_STATUSES } from '../../constants';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import EducationBadge from './EducationBadge';
import Modal from '../common/Modal';

const EducationSelector = ({ selectedEducation, onChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    level: '',
    subject: '',
    institution: '',
    yearCompleted: '',
    status: '',
    grade: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.level.trim()) {
      errors.level = 'Education level is required';
    }

    // Optional field validations
    if (formData.subject && formData.subject.length > 100) {
      errors.subject = 'Field of study must be less than 100 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddEducation = () => {
    if (!validateForm()) {
      return;
    }

    const newEducation = {
      id: uuidv4(),
      level: formData.level,
      subject: formData.subject || '',
      institution: formData.institution || '',
      yearCompleted: formData.yearCompleted || '',
      status: formData.status || 'Completed', // Default to Completed if not specified
      grade: formData.grade || ''
    };

    onChange([...selectedEducation, newEducation]);

    // Reset form
    setFormData({
      level: '',
      subject: '',
      institution: '',
      yearCompleted: '',
      status: '',
      grade: ''
    });
    setFormErrors({});
    setShowAddForm(false);
  };

  const handleRemoveEducation = (id) => {
    onChange(selectedEducation.filter((e) => e.id !== id));
    setDeleteConfirm(null);
  };

  const handleCancelForm = () => {
    setFormData({
      level: '',
      subject: '',
      institution: '',
      yearCompleted: '',
      status: '',
      grade: ''
    });
    setFormErrors({});
    setShowAddForm(false);
  };

  // Sort education by year completed (most recent first)
  const sortedEducation = [...selectedEducation].sort((a, b) => {
    if (!a.yearCompleted && !b.yearCompleted) return 0;
    if (!a.yearCompleted) return 1;
    if (!b.yearCompleted) return -1;
    return parseInt(b.yearCompleted) - parseInt(a.yearCompleted);
  });

  // Check if form has required fields filled (only level is required)
  const isFormValid = formData.level.trim();

  return (
    <div className="space-y-4">
      {/* Display selected education */}
      {sortedEducation.length > 0 && (
        <div className="space-y-3">
          {sortedEducation.map((edu) => (
            <div
              key={edu.id}
              className="group relative bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <EducationBadge level={edu.level} size="sm" />
                    <span className="font-semibold text-gray-900">{edu.institution}</span>
                  </div>

                  <div className="text-sm text-gray-700">
                    <span className="font-medium">{edu.subject}</span>
                    {edu.yearCompleted && (
                      <>
                        {' • '}
                        <span className="text-gray-600">{edu.yearCompleted}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        edu.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : edu.status === 'In Progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {edu.status}
                    </span>
                    {edu.grade && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-medium">
                        {edu.grade}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteConfirm(edu.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                  title="Remove education"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Education Form */}
      {!showAddForm ? (
        <Button variant="ghost" onClick={() => setShowAddForm(true)} type="button" size="sm">
          + Add Education
        </Button>
      ) : (
        <div className="bg-white border-2 border-primary-200 rounded-xl p-6 space-y-4 animate-fade-in">
          <h4 className="font-semibold text-gray-900 text-lg">Add Education</h4>

          {/* Education Level */}
          <div>
            <Select
              label="Education Level"
              name="level"
              value={formData.level}
              onChange={handleFormChange}
              options={EDUCATION_LEVELS}
              required
              error={formErrors.level}
            />
          </div>

          {/* Subject/Field of Study */}
          <div>
            <Input
              label="Subject/Field of Study (Optional)"
              name="subject"
              value={formData.subject}
              onChange={handleFormChange}
              placeholder="e.g., Computer Science, Business Administration, Mechanical Engineering"
              error={formErrors.subject}
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your field of study or specialization ({formData.subject.length}/100)
            </p>
          </div>

          {/* Institution Name */}
          <div>
            <Input
              label="Institution Name (Optional)"
              name="institution"
              value={formData.institution}
              onChange={handleFormChange}
              placeholder="e.g., University of London, Harvard Business School"
              error={formErrors.institution}
            />
            <p className="text-xs text-gray-500 mt-1">Optional - Leave blank if not applicable</p>
          </div>

          {/* Year Completed */}
          <div>
            <Input
              label="Year Completed"
              name="yearCompleted"
              type="number"
              value={formData.yearCompleted}
              onChange={handleFormChange}
              placeholder="e.g., 2020, 2023"
              min="1950"
              max={new Date().getFullYear() + 10}
            />
            <p className="text-xs text-gray-500 mt-1">Optional - Leave blank if not applicable</p>
          </div>

          {/* Status */}
          <div>
            <Select
              label="Status (Optional)"
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              options={EDUCATION_STATUSES}
              error={formErrors.status}
            />
            <p className="text-xs text-gray-500 mt-1">Optional - Defaults to "Completed" if not specified</p>
          </div>

          {/* Grade/GPA */}
          <div>
            <Input
              label="Grade/GPA"
              name="grade"
              value={formData.grade}
              onChange={handleFormChange}
              placeholder="e.g., First Class, 3.8 GPA, Distinction"
            />
            <p className="text-xs text-gray-500 mt-1">Optional</p>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleAddEducation} type="button" disabled={!isFormValid}>
              Add Education
            </Button>
            <Button variant="secondary" onClick={handleCancelForm} type="button">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirm(null)}
          title="Remove Education"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to remove this education entry? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleRemoveEducation(deleteConfirm)}>
                Remove
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EducationSelector;
