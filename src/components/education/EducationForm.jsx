import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { validateEducation } from '../../utils/validators';
import { EDUCATION_CATEGORIES, EDUCATION_STATUSES } from '../../constants';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const EducationForm = ({ isOpen, onClose, editEducation = null }) => {
  const { addEducation, updateEducation } = useContext(AppContext);

  const [formData, setFormData] = useState(
    editEducation || {
      institution: '',
      degree: '',
      field: '',
      year: '',
      status: '',
      category: ''
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

    const validation = validateEducation(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (editEducation) {
      updateEducation(editEducation.id, formData);
    } else {
      addEducation(formData);
    }

    handleClose();
  };

  const handleClose = () => {
    setFormData({ institution: '', degree: '', field: '', year: '', status: '', category: '' });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={editEducation ? 'Edit Education' : 'Add New Education'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Institution Name"
          name="institution"
          value={formData.institution}
          onChange={handleChange}
          placeholder="e.g., Stanford University, AWS, Udemy"
          required
          error={errors.institution}
        />

        <Input
          label="Degree/Qualification"
          name="degree"
          value={formData.degree}
          onChange={handleChange}
          placeholder="e.g., Bachelor of Science, AWS Certified"
          required
          error={errors.degree}
        />

        <Input
          label="Field of Study"
          name="field"
          value={formData.field}
          onChange={handleChange}
          placeholder="e.g., Computer Science, Cloud Computing"
          required
          error={errors.field}
        />

        <Input
          label="Year Completed"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="e.g., 2020"
          required
          error={errors.year}
        />

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={EDUCATION_STATUSES}
          required
          error={errors.status}
        />

        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={EDUCATION_CATEGORIES}
          required
          error={errors.category}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button type="submit">{editEducation ? 'Update' : 'Add'} Education</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EducationForm;
