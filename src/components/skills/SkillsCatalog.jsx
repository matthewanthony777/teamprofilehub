import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { SKILL_CATEGORIES } from '../../constants';
import Button from '../common/Button';
import SkillForm from './SkillForm';
import ConfirmDialog from '../common/ConfirmDialog';

const SkillsCatalog = () => {
  const { skills, deleteSkill } = useContext(AppContext);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editSkill, setEditSkill] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleEdit = (skill) => {
    setEditSkill(skill);
    setShowSkillForm(true);
  };

  const handleCloseForm = () => {
    setShowSkillForm(false);
    setEditSkill(null);
  };

  const handleDelete = (skill) => {
    setDeleteConfirm(skill);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteSkill(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const skillsByCategory = SKILL_CATEGORIES.reduce((acc, category) => {
    acc[category] = skills.filter((skill) => skill.category === category);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Skills Catalog</h2>
        <Button onClick={() => setShowSkillForm(true)}>Add Skill</Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm text-gray-600 mb-4">Total Skills: {skills.length}</div>

        <div className="space-y-6">
          {SKILL_CATEGORIES.map((category) => (
            <div key={category} className="border-b border-gray-200 pb-4 last:border-b-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>

              {skillsByCategory[category].length === 0 ? (
                <p className="text-sm text-gray-500 italic">No skills in this category</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {skillsByCategory[category].map((skill) => (
                    <div
                      key={skill.id}
                      className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{skill.name}</h4>
                          {skill.description && (
                            <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
                          )}
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => handleEdit(skill)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleDelete(skill)}
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

      <SkillForm
        isOpen={showSkillForm}
        onClose={handleCloseForm}
        editSkill={editSkill}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Skill"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This will remove the skill from all employees.`}
      />
    </div>
  );
};

export default SkillsCatalog;
