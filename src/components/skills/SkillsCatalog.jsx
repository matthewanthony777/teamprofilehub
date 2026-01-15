import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { SKILL_CATEGORIES } from '../../constants';
import PageLayout from '../PageLayout';
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
    <PageLayout
      title="Skills Catalog"
      description={`Total Skills: ${skills.length}`}
      actions={
        <Button onClick={() => setShowSkillForm(true)}>Add Skill</Button>
      }
    >
      <div className="space-y-6">
        {SKILL_CATEGORIES.map((category) => (
          <div key={category} className="bg-dark-surface border border-dark-border rounded-xl p-6">
            <h3 className="text-base font-semibold text-white mb-4">{category}</h3>

            {skillsByCategory[category].length === 0 ? (
              <p className="text-sm text-gray-500 italic">No skills in this category</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skillsByCategory[category].map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 bg-dark-card border border-dark-border rounded-lg hover:border-accent-primary transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white">{skill.name}</h4>
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="text-accent-primary hover:text-accent-hover text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(skill)}
                          className="text-red-500 hover:text-red-400 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {skill.description && (
                      <p className="text-sm text-gray-400">{skill.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
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
    </PageLayout>
  );
};

export default SkillsCatalog;
