import { useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from '../../context/AppContext';
import { EDUCATION_LEVELS, EDUCATION_STATUSES } from '../../constants';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import EducationBadge from './EducationBadge';
import Modal from '../common/Modal';

const EducationSelector = ({ selectedEducation, onChange }) => {
  const { education: globalEducation, addEducation } = useContext(AppContext);
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

    // Add to employee's education list
    onChange([...selectedEducation, newEducation]);

    // AUTO-ADD TO GLOBAL EDUCATION CATALOG
    // Check if similar education already exists in global catalog
    const existingInCatalog = globalEducation.find(
      edu =>
        edu &&
        edu.institution === newEducation.institution &&
        edu.degree === newEducation.level &&
        edu.field === newEducation.subject
    );

    if (!existingInCatalog && newEducation.institution) {
      // Only add to catalog if institution is provided and doesn't already exist
      const catalogEntry = {
        institution: newEducation.institution,
        degree: newEducation.level,
        field: newEducation.subject || 'General',
        year: newEducation.yearCompleted || new Date().getFullYear().toString(),
        status: newEducation.status || 'Completed',
        category: getCategoryFromLevel(newEducation.level)
      };

      console.log('Auto-adding education to catalog:', catalogEntry);
      addEducation(catalogEntry);
    }

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

  // Helper function to map education level to category
  const getCategoryFromLevel = (level) => {
    const levelToCategoryMap = {
      "Bachelor's Degree": "Degree",
      "Master's Degree": "Degree",
      "Doctorate (PhD)": "Degree",
      "Associate Degree": "Degree",
      "High School Diploma": "Degree",
      "Professional Certification": "Certification",
      "Technical Certification": "Certification",
      "Online Course": "Course",
      "Bootcamp": "Bootcamp",
      "Self-taught": "Self-taught"
    };
    return levelToCategoryMap[level] || "Degree";
  };

  const handleRemoveEducation = (id) => {
    onChange(selectedEducation.filter((e) => e && e.id !== id));
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
    if (!a || !b) return 0;
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
      {sortedEducation.length > 0 ? (
        <div className="space-y-3">
          {sortedEducation.map((edu) => {
            if (!edu || !edu.id) return null;
            return (
              <div
                key={edu.id}
                className="group relative bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-4 hover:border-[#3a3a3a] transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <EducationBadge level={edu.level} size="sm" />
                      <span className="font-medium text-white">{edu.institution}</span>
                    </div>

                    <div className="text-sm text-gray-400">
                      <span className="font-medium">{edu.subject}</span>
                      {edu.yearCompleted && (
                        <>
                          {' • '}
                          <span className="text-gray-500">{edu.yearCompleted}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium ${
                          edu.status === 'Completed'
                            ? 'bg-green-500/20 text-green-400'
                            : edu.status === 'In Progress'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {edu.status}
                      </span>
                      {edu.grade && (
                        <span className="px-2 py-0.5 bg-[#3b82f6]/20 text-[#3b82f6] rounded-full font-medium">
                          {edu.grade}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(edu.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
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
            );
          })}
        </div>
      ) : (
        !showAddForm && (
          <div className="text-center py-6 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg">
            <svg className="w-10 h-10 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            <p className="text-sm text-gray-500">No education added yet</p>
          </div>
        )
      )}

      {/* Add Education Form */}
      {!showAddForm ? (
        <Button variant="ghost" onClick={() => setShowAddForm(true)} type="button" size="sm">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Education
          </span>
        </Button>
      ) : (
        <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-6 space-y-4">
          <h4 className="font-semibold text-white text-base">Add Education</h4>

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
              placeholder="e.g., Computer Science, Business Administration"
              error={formErrors.subject}
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your field of study ({formData.subject.length}/100)
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
          <div className="flex gap-3 pt-4 border-t border-[#2a2a2a]">
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
            <p className="text-gray-400">
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
