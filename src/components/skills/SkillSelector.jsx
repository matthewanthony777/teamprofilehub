import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { PROFICIENCY_LEVELS } from '../../constants';
import Button from '../common/Button';
import SkillBadge from './SkillBadge';

const SkillSelector = ({ selectedSkills, onChange }) => {
  const { skills } = useContext(AppContext);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [proficiencyLevel, setProficiencyLevel] = useState('Beginner');

  const handleAddSkill = () => {
    if (!selectedSkillId) return;

    const skill = skills.find((s) => s && s.id === selectedSkillId);
    if (!skill) return;

    // Check if skill already added
    if (selectedSkills.some((s) => s && s.skillId === selectedSkillId)) {
      alert('This skill is already added');
      return;
    }

    const newSkill = {
      skillId: selectedSkillId,
      proficiencyLevel
    };

    onChange([...selectedSkills, newSkill]);
    setSelectedSkillId('');
    setProficiencyLevel('Beginner');
    setShowAddSkill(false);
  };

  const handleRemoveSkill = (skillId) => {
    onChange(selectedSkills.filter((s) => s && s.skillId !== skillId));
  };

  const handleProficiencyChange = (skillId, newProficiency) => {
    onChange(
      selectedSkills.map((s) =>
        s && s.skillId === skillId ? { ...s, proficiencyLevel: newProficiency } : s
      )
    );
  };

  const availableSkills = skills.filter(
    (skill) => skill && !selectedSkills.some((s) => s && s.skillId === skill.id)
  );

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Skills</label>

      {/* Display selected skills */}
      {selectedSkills.length > 0 && (
        <div className="space-y-2">
          {selectedSkills.map((empSkill) => {
            if (!empSkill || !empSkill.skillId) return null;
            const skill = skills.find((s) => s && s.id === empSkill.skillId);
            if (!skill) return null;

            return (
              <div
                key={empSkill.skillId}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <select
                    value={empSkill.proficiencyLevel}
                    onChange={(e) => handleProficiencyChange(empSkill.skillId, e.target.value)}
                    className="text-sm px-2 py-1 border border-gray-300 rounded"
                  >
                    {PROFICIENCY_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(empSkill.skillId)}
                  className="text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add new skill section */}
      {!showAddSkill ? (
        <Button
          variant="ghost"
          onClick={() => setShowAddSkill(true)}
          type="button"
          size="sm"
        >
          + Add Skill
        </Button>
      ) : (
        <div className="p-3 border border-gray-300 rounded-md space-y-2">
          <select
            value={selectedSkillId}
            onChange={(e) => setSelectedSkillId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a skill...</option>
            {availableSkills.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name} ({skill.category})
              </option>
            ))}
          </select>

          <select
            value={proficiencyLevel}
            onChange={(e) => setProficiencyLevel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PROFICIENCY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <Button onClick={handleAddSkill} type="button" size="sm">
              Add
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddSkill(false);
                setSelectedSkillId('');
                setProficiencyLevel('Beginner');
              }}
              type="button"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillSelector;
