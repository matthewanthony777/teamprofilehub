import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { EDUCATION_CATEGORIES } from '../../constants';
import PageLayout from '../PageLayout';
import Button from '../common/Button';
import EducationForm from './EducationForm';
import ConfirmDialog from '../common/ConfirmDialog';

const EducationCatalog = () => {
  const { education, deleteEducation } = useContext(AppContext);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [editEducation, setEditEducation] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleEdit = (edu) => {
    setEditEducation(edu);
    setShowEducationForm(true);
  };

  const handleCloseForm = () => {
    setShowEducationForm(false);
    setEditEducation(null);
  };

  const handleDelete = (edu) => {
    setDeleteConfirm(edu);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteEducation(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const educationByCategory = EDUCATION_CATEGORIES.reduce((acc, category) => {
    acc[category] = education.filter((edu) => edu.category === category);
    return acc;
  }, {});

  return (
    <PageLayout
      title="Education Catalog"
      description={`Total Education Entries: ${education.length}`}
      actions={
        <Button onClick={() => setShowEducationForm(true)}>Add Education</Button>
      }
    >
      <div className="space-y-6">
        {EDUCATION_CATEGORIES.map((category) => (
          <div key={category} className="bg-dark-surface border border-dark-border rounded-xl p-6">
            <h3 className="text-base font-semibold text-white mb-4">{category}</h3>

            {educationByCategory[category].length === 0 ? (
              <p className="text-sm text-gray-500 italic">No education entries in this category</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {educationByCategory[category].map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 bg-dark-card border border-dark-border rounded-lg hover:border-accent-primary transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-1">{edu.degree}</h4>
                        <p className="text-sm text-gray-400">{edu.field}</p>
                        <p className="text-sm text-gray-500">{edu.institution}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">{edu.year}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${edu.status === 'Completed' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}`}>
                            {edu.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={() => handleEdit(edu)}
                          className="text-accent-primary hover:text-accent-hover text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(edu)}
                          className="text-red-500 hover:text-red-400 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <EducationForm
        isOpen={showEducationForm}
        onClose={handleCloseForm}
        editEducation={editEducation}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Education"
        message={`Are you sure you want to delete "${deleteConfirm?.degree} from ${deleteConfirm?.institution}"? This will remove it from all employees.`}
      />
    </PageLayout>
  );
};

export default EducationCatalog;
