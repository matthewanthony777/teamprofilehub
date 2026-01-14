import { v4 as uuidv4 } from 'uuid';

// Safe helper to get skill ID by name
const getSkillId = (skills, name) => {
  const skill = skills.find(s => s && s.name === name);
  if (!skill || !skill.id) {
    console.warn(`Skill not found: ${name}`);
    return null;
  }
  return skill.id;
};

// Safe helper to get education ID by institution
const getEducationId = (education, institution, degree = null) => {
  const edu = education.find(e => {
    if (!e) return false;
    if (degree) {
      return e.institution === institution && e.degree === degree;
    }
    return e.institution === institution;
  });
  if (!edu || !edu.id) {
    console.warn(`Education not found: ${institution}${degree ? ` (${degree})` : ''}`);
    return null;
  }
  return edu.id;
};

export const seedSkills = () => {
  const skills = [
    // Technical Skills
    { name: 'React', category: 'Technical', description: 'JavaScript library for building user interfaces' },
    { name: 'JavaScript', category: 'Technical', description: 'Programming language for web development' },
    { name: 'TypeScript', category: 'Technical', description: 'Typed superset of JavaScript' },
    { name: 'Node.js', category: 'Technical', description: 'JavaScript runtime for server-side development' },
    { name: 'Python', category: 'Technical', description: 'High-level programming language' },
    { name: 'Java', category: 'Technical', description: 'Object-oriented programming language' },
    { name: 'SQL', category: 'Technical', description: 'Database query language' },
    { name: 'MongoDB', category: 'Technical', description: 'NoSQL database' },
    { name: 'Docker', category: 'Technical', description: 'Containerization platform' },
    { name: 'Kubernetes', category: 'Technical', description: 'Container orchestration platform' },
    { name: 'AWS', category: 'Technical', description: 'Amazon Web Services cloud platform' },
    { name: 'Git', category: 'Technical', description: 'Version control system' },
    { name: 'GraphQL', category: 'Technical', description: 'Query language for APIs' },
    { name: 'REST APIs', category: 'Technical', description: 'RESTful API design and development' },
    { name: 'CSS', category: 'Technical', description: 'Styling language for web pages' },
    { name: 'HTML', category: 'Technical', description: 'Markup language for web pages' },
    { name: 'Vue.js', category: 'Technical', description: 'Progressive JavaScript framework' },
    { name: 'Angular', category: 'Technical', description: 'TypeScript-based web framework' },
    { name: 'Machine Learning', category: 'Technical', description: 'AI and ML algorithms' },
    { name: 'Data Analysis', category: 'Technical', description: 'Analyzing and interpreting data' },

    // Soft Skills
    { name: 'Project Management', category: 'Soft Skills', description: 'Planning and managing projects' },
    { name: 'Leadership', category: 'Soft Skills', description: 'Leading and motivating teams' },
    { name: 'Communication', category: 'Soft Skills', description: 'Effective verbal and written communication' },
    { name: 'Problem Solving', category: 'Soft Skills', description: 'Analyzing and solving complex problems' },
    { name: 'Team Collaboration', category: 'Soft Skills', description: 'Working effectively in teams' },
    { name: 'Critical Thinking', category: 'Soft Skills', description: 'Analytical and logical thinking' },
    { name: 'Time Management', category: 'Soft Skills', description: 'Managing time effectively' },
    { name: 'Adaptability', category: 'Soft Skills', description: 'Adapting to change' },
    { name: 'Creativity', category: 'Soft Skills', description: 'Creative thinking and innovation' },
    { name: 'Presentation Skills', category: 'Soft Skills', description: 'Presenting ideas effectively' },

    // Certifications
    { name: 'AWS Certified Solutions Architect', category: 'Certifications', description: 'AWS architecture certification' },
    { name: 'PMP', category: 'Certifications', description: 'Project Management Professional certification' },
    { name: 'Scrum Master', category: 'Certifications', description: 'Certified Scrum Master' },
    { name: 'Google Cloud Professional', category: 'Certifications', description: 'Google Cloud certification' },
    { name: 'Microsoft Azure Certified', category: 'Certifications', description: 'Azure cloud certification' },

    // Languages
    { name: 'English', category: 'Languages', description: 'English language proficiency' },
    { name: 'Spanish', category: 'Languages', description: 'Spanish language proficiency' },
    { name: 'French', category: 'Languages', description: 'French language proficiency' },
    { name: 'German', category: 'Languages', description: 'German language proficiency' },
    { name: 'Mandarin', category: 'Languages', description: 'Mandarin Chinese proficiency' }
  ];

  return skills.map(skill => ({
    ...skill,
    id: uuidv4(),
    createdAt: new Date().toISOString()
  }));
};

export const seedEducation = () => {
  const education = [
    { institution: 'Stanford University', degree: 'Bachelor of Science', field: 'Computer Science', year: '2020', status: 'Completed', category: 'Degree' },
    { institution: 'MIT', degree: 'Master of Science', field: 'Artificial Intelligence', year: '2022', status: 'Completed', category: 'Degree' },
    { institution: 'Harvard University', degree: 'MBA', field: 'Business Administration', year: '2019', status: 'Completed', category: 'Degree' },
    { institution: 'AWS', degree: 'Solutions Architect Professional', field: 'Cloud Computing', year: '2023', status: 'Completed', category: 'Certification' },
    { institution: 'Google', degree: 'UX Design Certificate', field: 'User Experience Design', year: '2022', status: 'Completed', category: 'Certification' },
    { institution: 'Udemy', degree: 'Full Stack Development', field: 'Web Development', year: '2021', status: 'Completed', category: 'Course' },
    { institution: 'Coursera', degree: 'Data Science Specialization', field: 'Data Science', year: '2023', status: 'Completed', category: 'Course' },
    { institution: 'General Assembly', degree: 'Software Engineering Immersive', field: 'Software Engineering', year: '2020', status: 'Completed', category: 'Bootcamp' },
    { institution: 'Le Wagon', degree: 'Web Development Bootcamp', field: 'Web Development', year: '2021', status: 'Completed', category: 'Bootcamp' },
    { institution: 'Self-Study', degree: 'React & Modern JavaScript', field: 'Frontend Development', year: '2024', status: 'In Progress', category: 'Self-taught' }
  ];

  return education.map(edu => ({
    ...edu,
    id: uuidv4(),
    createdAt: new Date().toISOString()
  }));
};

export const seedEmployees = (skills, education) => {
  // Helper to build skills array with null filtering
  const buildSkills = (skillNames) => {
    return skillNames
      .map(({ name, proficiency }) => {
        const skillId = getSkillId(skills, name);
        if (!skillId) return null;
        return { skillId, proficiencyLevel: proficiency };
      })
      .filter(Boolean);
  };

  // Helper to build education array with null filtering
  const buildEducation = (eduList) => {
    return eduList
      .map(({ institution, degree }) => {
        const educationId = getEducationId(education, institution, degree);
        if (!educationId) return null;
        return { educationId };
      })
      .filter(Boolean);
  };

  const employees = [
    {
      name: 'Sarah Johnson',
      role: 'Senior Software Engineer',
      department: 'Engineering',
      email: 'sarah.johnson@sqc.com',
      hireDate: '2022-03-15',
      phone: '+1 555-0101',
      aboutMe: 'Passionate full-stack developer with 8 years of experience building scalable web applications. Love mentoring junior developers and exploring new technologies.',
      careerTimeline: [
        { id: uuidv4(), period: '2024-01 - Present', title: 'Leading Platform Modernization', description: 'Architecting and implementing microservices migration for core platform' },
        { id: uuidv4(), period: '2023-06 - 2023-12', title: 'Internal Tools Development', description: 'Built developer productivity tools that reduced deployment time by 40%' },
        { id: uuidv4(), period: '2022-03 - 2023-05', title: 'Frontend Refactor Project', description: 'Led team to migrate legacy jQuery codebase to React' }
      ],
      careerNextSteps: 'Looking to transition into a technical leadership role, focusing on architecture and mentoring the next generation of engineers.',
      previousExperience: 'Worked at a fintech startup as Lead Frontend Engineer, building trading platforms and real-time dashboards.',
      skills: buildSkills([
        { name: 'React', proficiency: 'Expert' },
        { name: 'JavaScript', proficiency: 'Expert' },
        { name: 'TypeScript', proficiency: 'Advanced' },
        { name: 'Node.js', proficiency: 'Advanced' },
        { name: 'AWS', proficiency: 'Intermediate' }
      ]),
      education: buildEducation([
        { institution: 'Stanford University' },
        { institution: 'Udemy' }
      ])
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      department: 'Product',
      email: 'michael.chen@sqc.com',
      hireDate: '2021-06-01',
      phone: '+1 555-0102',
      aboutMe: 'Product leader with a strong technical background. I bridge the gap between engineering and business to deliver customer-centric solutions.',
      careerTimeline: [
        { id: uuidv4(), period: '2024-03 - Present', title: 'Mobile App Strategy', description: 'Leading development of iOS and Android apps with 50K+ downloads' },
        { id: uuidv4(), period: '2023-01 - 2024-02', title: 'API Platform Launch', description: 'Launched developer API platform, onboarding 100+ partners' },
        { id: uuidv4(), period: '2021-06 - 2022-12', title: 'Core Product Enhancement', description: 'Drove 30% increase in user engagement through feature optimization' }
      ],
      careerNextSteps: 'Aiming for VP of Product role, focusing on strategic planning and cross-functional leadership.',
      previousExperience: 'Product Manager at a SaaS company, managing B2B enterprise products with $10M+ ARR.',
      skills: buildSkills([
        { name: 'Project Management', proficiency: 'Expert' },
        { name: 'Leadership', proficiency: 'Advanced' },
        { name: 'Communication', proficiency: 'Expert' },
        { name: 'Data Analysis', proficiency: 'Intermediate' }
      ]),
      education: buildEducation([
        { institution: 'Harvard University' },
        { institution: 'AWS', degree: 'Solutions Architect Professional' }
      ])
    },
    {
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      department: 'Design',
      email: 'emily.rodriguez@sqc.com',
      hireDate: '2023-01-10',
      phone: '+1 555-0103',
      aboutMe: 'Creative designer passionate about creating intuitive user experiences. Advocate for accessibility and inclusive design practices.',
      careerTimeline: [
        { id: uuidv4(), period: '2024-01 - Present', title: 'Design System Evolution', description: 'Rebuilding component library with accessibility-first approach' },
        { id: uuidv4(), period: '2023-06 - 2023-12', title: 'Mobile App Redesign', description: 'Led complete redesign of mobile app, improving NPS by 25 points' },
        { id: uuidv4(), period: '2023-01 - 2023-05', title: 'Onboarding Flow Optimization', description: 'Redesigned user onboarding, reducing drop-off by 35%' }
      ],
      careerNextSteps: 'Growing into a design leadership role while maintaining hands-on design work. Interested in product strategy.',
      previousExperience: 'UI/UX Designer at a digital agency, worked with clients across e-commerce, healthcare, and education sectors.',
      skills: buildSkills([
        { name: 'CSS', proficiency: 'Expert' },
        { name: 'HTML', proficiency: 'Expert' },
        { name: 'Creativity', proficiency: 'Expert' },
        { name: 'Communication', proficiency: 'Advanced' }
      ]),
      education: buildEducation([
        { institution: 'Google', degree: 'UX Design Certificate' }
      ])
    },
    {
      name: 'David Kim',
      role: 'Data Scientist',
      department: 'Engineering',
      email: 'david.kim@sqc.com',
      hireDate: '2022-08-20',
      phone: '+1 555-0104',
      aboutMe: 'Data scientist specializing in machine learning and predictive analytics. Love turning complex data into actionable insights.',
      careerTimeline: [
        { id: uuidv4(), period: '2024-02 - Present', title: 'ML Model Optimization', description: 'Improving recommendation algorithm accuracy by 20%' },
        { id: uuidv4(), period: '2023-03 - 2024-01', title: 'Customer Churn Prediction', description: 'Built ML model that reduced customer churn by 15%' },
        { id: uuidv4(), period: '2022-08 - 2023-02', title: 'Data Pipeline Infrastructure', description: 'Established data warehouse and ETL pipelines' }
      ],
      careerNextSteps: 'Looking to lead a data science team and drive AI strategy across the organization.',
      previousExperience: 'Data Analyst at tech company, focused on business intelligence and reporting for executive team.',
      skills: buildSkills([
        { name: 'Python', proficiency: 'Expert' },
        { name: 'Machine Learning', proficiency: 'Advanced' },
        { name: 'Data Analysis', proficiency: 'Expert' },
        { name: 'SQL', proficiency: 'Advanced' }
      ]),
      education: buildEducation([
        { institution: 'MIT' },
        { institution: 'Coursera' }
      ])
    },
    {
      name: 'Jessica Williams',
      role: 'Marketing Manager',
      department: 'Marketing',
      email: 'jessica.williams@sqc.com',
      hireDate: '2021-11-05',
      phone: '+1 555-0105',
      aboutMe: 'Creative marketing professional with expertise in digital campaigns and brand strategy. Data-driven approach to growth.',
      careerTimeline: [
        { id: uuidv4(), period: '2024-01 - Present', title: 'Brand Refresh Campaign', description: 'Leading company rebrand and go-to-market strategy' },
        { id: uuidv4(), period: '2023-03 - 2023-12', title: 'Content Marketing Expansion', description: 'Grew organic traffic by 150% through content strategy' },
        { id: uuidv4(), period: '2021-11 - 2023-02', title: 'Digital Advertising', description: 'Managed $500K ad budget across Google, Facebook, LinkedIn' }
      ],
      careerNextSteps: 'Aspiring to become CMO, focusing on strategic growth initiatives and team building.',
      previousExperience: 'Marketing Specialist at consumer brand, managed social media and influencer partnerships.',
      skills: buildSkills([
        { name: 'Communication', proficiency: 'Expert' },
        { name: 'Creativity', proficiency: 'Advanced' },
        { name: 'Project Management', proficiency: 'Advanced' },
        { name: 'Presentation Skills', proficiency: 'Expert' }
      ]),
      education: buildEducation([
        { institution: 'Harvard University' }
      ])
    }
  ];

  return employees.map(emp => ({
    ...emp,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

export const initializeSeedData = () => {
  const skills = seedSkills();
  const education = seedEducation();
  const employees = seedEmployees(skills, education);
  return { skills, education, employees };
};
