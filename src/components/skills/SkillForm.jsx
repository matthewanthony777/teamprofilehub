import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { validateSkill } from '../../utils/validators';
import { SKILL_CATEGORIES } from '../../constants';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const SkillForm = ({ isOpen, onClose, editSkill = null }) => {
  const { addSkill, updateSkill } = useContext(AppContext);

  const [formData, setFormData] = useState(
    editSkill || {
      name: '',
      category: '',
      description: ''
    }
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateSkill(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (editSkill) {
      updateSkill(editSkill.id, formData);
    } else {
      addSkill(formData);
    }

    handleClose();
  };

  const handleClose = () => {
    setFormData({ name: '', category: '', description: '' });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={editSkill ? 'Edit Skill' : 'Add New Skill'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Skill Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., React, Leadership"
          required
          error={errors.name}
        />

        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={SKILL_CATEGORIES}
          required
          error={errors.category}
        />

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the skill"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button type="submit">{editSkill ? 'Update' : 'Add'} Skill</Button>
        </div>
      </form>
    </Modal>
  );
};

export default SkillForm;
