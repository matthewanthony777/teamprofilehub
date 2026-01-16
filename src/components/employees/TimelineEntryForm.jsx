import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { validateTimelineEntry } from '../../utils/validators';
import { findOverlappingEntries, formatDateRange } from '../../utils/timeline';
import { TIMELINE_STATUSES, DEFAULT_TIMELINE_TAGS } from '../../constants';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const TimelineEntryForm = ({ isOpen, onClose, onAdd, editEntry = null, allEntries = [] }) => {
  const [formData, setFormData] = useState(
    editEntry || {
      startDate: '',
      endDate: '',
      title: '',
      description: '',
      status: 'In Progress',
      tags: []
    }
  );

  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [overlappingProjects, setOverlappingProjects] = useState([]);

  // Check for overlaps when dates change
  useEffect(() => {
    if (formData.startDate) {
      const overlaps = findOverlappingEntries(
        { ...formData, id: editEntry?.id || 'temp' },
        allEntries
      );
      setOverlappingProjects(overlaps);
    }
  }, [formData.startDate, formData.endDate, allEntries, editEntry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput('');
    setShowTagSuggestions(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
    setShowTagSuggestions(e.target.value.length > 0);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag(tagInput.trim());
    }
  };

  const filteredTagSuggestions = DEFAULT_TIMELINE_TAGS.filter(
    tag => !formData.tags.includes(tag) &&
      tag.toLowerCase().includes(tagInput.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateTimelineEntry(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const entry = {
      ...formData,
      id: editEntry?.id || uuidv4(),
      tags: formData.tags || []
    };

    onAdd(entry);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      startDate: '',
      endDate: '',
      title: '',
      description: '',
      status: 'In Progress',
      tags: []
    });
    setErrors({});
    setTagInput('');
    setShowTagSuggestions(false);
    setOverlappingProjects([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editEntry ? 'Edit Timeline Entry' : 'Add Timeline Entry'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
            error={errors.startDate}
          />

          <div>
            <Input
              label="End Date (Optional)"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              error={errors.endDate}
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank if project is ongoing</p>
          </div>
        </div>

        {/* Overlap Warning */}
        {overlappingProjects.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-400">
                  Concurrent with {overlappingProjects.length} other project{overlappingProjects.length > 1 ? 's' : ''}
                </p>
                <ul className="text-xs text-amber-400/80 mt-1 space-y-1">
                  {overlappingProjects.map(project => {
                    if (!project || !project.id) return null;
                    return (
                      <li key={project.id}>
                        • {project?.title || 'Untitled'} ({formatDateRange(project.startDate, project.endDate)})
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Project Title */}
        <Input
          label="Project/Role Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Leading Platform Modernization"
          required
          error={errors.title}
        />

        {/* Status */}
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={TIMELINE_STATUSES}
          required
        />

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what you worked on, the impact, and key achievements..."
            rows={4}
            required
            className={`w-full px-4 py-2.5 bg-[#0a0a0a] border rounded-lg text-white placeholder-gray-600 focus:outline-none transition-all resize-none ${
              errors.description ? 'border-red-500' : 'border-[#2a2a2a] focus:border-[#3b82f6] hover:border-[#3a3a3a]'
            }`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Tags (Optional)
          </label>

          {/* Selected Tags */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#3b82f6]/20 text-[#3b82f6] rounded-full text-xs font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-[#2563eb]"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tag Input */}
          <div className="relative">
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
              onFocus={() => setShowTagSuggestions(tagInput.length > 0)}
              placeholder="Type to add tags or choose from suggestions..."
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-600 focus:border-[#3b82f6] focus:outline-none"
            />

            {/* Tag Suggestions Dropdown */}
            {showTagSuggestions && filteredTagSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredTagSuggestions.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="w-full text-left px-4 py-2 hover:bg-[#2a2a2a] text-sm text-gray-300"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Press Enter to add custom tags, or select from suggestions
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#2a2a2a]">
          <Button variant="secondary" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button type="submit">{editEntry ? 'Update' : 'Add'} Entry</Button>
        </div>
      </form>
    </Modal>
  );
};

export default TimelineEntryForm;
