import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { PROFICIENCY_LEVELS } from '../../constants';
import Button from '../common/Button';

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

    // Store both skillId and skillName for cross-device compatibility
    const newSkill = {
      skillId: selectedSkillId,
      skillName: skill.name,
      skillCategory: skill.category,
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
      {/* Display selected skills */}
      {selectedSkills.length > 0 ? (
        <div className="space-y-2">
          {selectedSkills.map((empSkill) => {
            if (!empSkill || !empSkill.skillId) return null;
            const skill = skills.find((s) => s && s.id === empSkill.skillId);
            // Use stored skillName as fallback if skill not found by ID
            const displayName = skill?.name || empSkill.skillName || 'Unknown Skill';

            return (
              <div
                key={empSkill.skillId}
                className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-medium text-white">{displayName}</span>
                  <select
                    value={empSkill.proficiencyLevel}
                    onChange={(e) => handleProficiencyChange(empSkill.skillId, e.target.value)}
                    className="text-sm px-3 py-1.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-white focus:border-[#3b82f6] focus:outline-none"
                  >
                    {PROFICIENCY_LEVELS.map((level) => (
                      <option key={level} value={level} className="bg-[#141414]">
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(empSkill.skillId)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        !showAddSkill && (
          <div className="text-center py-6 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg">
            <svg className="w-10 h-10 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <p className="text-sm text-gray-500">No skills added yet</p>
          </div>
        )
      )}

      {/* Add new skill section */}
      {!showAddSkill ? (
        <Button
          variant="ghost"
          onClick={() => setShowAddSkill(true)}
          type="button"
          size="sm"
        >
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Skill
          </span>
        </Button>
      ) : (
        <div className="p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg space-y-3">
          <select
            value={selectedSkillId}
            onChange={(e) => setSelectedSkillId(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-white focus:border-[#3b82f6] focus:outline-none"
          >
            <option value="" className="bg-[#141414] text-gray-400">Select a skill...</option>
            {availableSkills.map((skill) => (
              <option key={skill.id} value={skill.id} className="bg-[#141414] text-white">
                {skill.name} ({skill.category})
              </option>
            ))}
          </select>

          <select
            value={proficiencyLevel}
            onChange={(e) => setProficiencyLevel(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-white focus:border-[#3b82f6] focus:outline-none"
          >
            {PROFICIENCY_LEVELS.map((level) => (
              <option key={level} value={level} className="bg-[#141414]">
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
