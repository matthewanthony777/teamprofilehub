import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { EDUCATION_CATEGORIES } from '../../constants';
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Education Catalog</h2>
        <Button onClick={() => setShowEducationForm(true)}>Add Education</Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm text-gray-600 mb-4">Total Education Entries: {education.length}</div>

        <div className="space-y-6">
          {EDUCATION_CATEGORIES.map((category) => (
            <div key={category} className="border-b border-gray-200 pb-4 last:border-b-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>

              {educationByCategory[category].length === 0 ? (
                <p className="text-sm text-gray-500 italic">No education entries in this category</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {educationByCategory[category].map((edu) => (
                    <div
                      key={edu.id}
                      className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                          <p className="text-sm text-gray-600 mt-1">{edu.field}</p>
                          <p className="text-sm text-gray-600">{edu.institution}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">{edu.year}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${edu.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {edu.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => handleEdit(edu)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleDelete(edu)}
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
            </div>
          ))}
        </div>
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
    </div>
  );
};

export default EducationCatalog;
