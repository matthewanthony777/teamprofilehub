# SQC Employee Hub

A modern, comprehensive employee database and analytics platform built with React, Vite, and TailwindCSS. Track employee skills, education, career timelines, and generate insights with powerful analytics.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/react-18.3.1-61DAFB.svg)
![Vite](https://img.shields.io/badge/vite-5.4.21-646CFF.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 👥 Employee Management
- **Complete Employee Profiles**: Name, role, department, contact information, and biography
- **Search & Filter**: Quick search and advanced filtering by department, role, and skills
- **Bulk Operations**: Export employee data to CSV
- **Profile Customization**: Rich employee profiles with avatars and detailed information

### 🎯 Skills Management
- **Skills Catalog**: Centralized skills database with categories (Technical, Soft Skills, Certifications, Languages)
- **Proficiency Tracking**: Track skill levels (Beginner, Intermediate, Advanced, Expert)
- **Skill Assignment**: Assign multiple skills to employees with proficiency levels
- **Visual Badges**: Color-coded skill badges for quick identification

### 🎓 Education Tracking
- **Flexible Education Entries**: Track degrees, certifications, courses, and bootcamps
- **Multiple Education Levels**: High School, Associate, Bachelor's, Master's, PhD, Professional Certifications, Bootcamps, Online Courses
- **Optional Fields**: Only education level required - all other fields optional for flexibility
- **Status Tracking**: Mark education as Completed, In Progress, or Discontinued

### 📅 Career Timeline with Overlap Detection ⭐ NEW!
- **Visual Timeline**: Interactive career timeline with project history
- **Date-Based Tracking**: Precise start and end dates for each project/role
- **Status Indicators**: Color-coded statuses (Completed, In Progress, On Hold)
- **Project Tags**: Categorize projects by type, priority, and technology
- **Concurrent Project Detection**: Automatically detects and displays overlapping projects
- **Real-time Overlap Warnings**: Get alerts when adding projects that overlap with existing ones
- **Duration Calculation**: Automatic calculation of project durations in months
- **Visual Overlap Indicators**: See at a glance which projects ran simultaneously

### 📊 Analytics Dashboard
- **Skills Distribution**: Visual breakdown of skills across the organization
- **Proficiency Analysis**: See skill proficiency levels across teams
- **Top 10 Skills**: Identify most common skills in your workforce
- **Education Distribution**: Analyze education levels by category (LIVE DATA!)
- **Department Composition**: Team size and skill distribution by department
- **Skills Gap Analysis**: Identify skills with low coverage or no experts
- **Department Filtering**: Analyze specific departments in detail
- **Export Analytics**: Export all analytics data to CSV for reporting

### 💾 Data Management
- **Local Storage**: All data persists in browser localStorage
- **No Backend Required**: Fully client-side application
- **CSV Export**: Export employees and analytics to CSV
- **Seed Data**: Pre-populated sample data for testing

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern Gradients**: Beautiful gradient designs throughout
- **Smooth Animations**: Polished transitions and hover effects
- **Intuitive Navigation**: Easy-to-use tab-based navigation
- **Dark Mode Ready**: Prepared for dark mode implementation

---

## 🛠 Tech Stack

### Core Technologies
- **React 18.3.1** - Modern React with hooks and context
- **Vite 5.4.21** - Lightning-fast build tool and dev server
- **TailwindCSS 3.4.17** - Utility-first CSS framework

### Data Visualization
- **Recharts 2.15.0** - Composable charting library
  - Bar charts
  - Pie charts
  - Interactive tooltips
  - Responsive charts

### Utilities
- **UUID** - Unique ID generation
- **LocalStorage** - Client-side data persistence

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

Check your versions:
```bash
node --version
npm --version
```

### Installation

1. **Clone or download the repository**
   ```bash
   cd "sqc employee database"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 📖 Usage Guide

### Dashboard Overview
The dashboard provides a quick overview of your organization:
- Total employees count
- Total skills in catalog
- Total education entries
- Recent employee additions

### Managing Employees

#### Add Employee
1. Click "Employees" tab
2. Click "Add Employee" button
3. Fill in required fields (Name, Email, Role, Department, Hire Date)
4. Optionally add skills, education, timeline entries
5. Click "Add Employee"

#### Edit Employee
1. Click on an employee card
2. Click "Edit" button
3. Modify any fields
4. Click "Update Employee"

#### Assign Skills
1. In employee form, scroll to "Skills" section
2. Click "Add Skill"
3. Select skill from dropdown
4. Choose proficiency level
5. Repeat for multiple skills

#### Add Education
1. In employee form, scroll to "Education" section
2. Click "Add Education"
3. Select education level (REQUIRED)
4. Optionally fill in: Subject, Institution, Year, Status, Grade
5. Click "Add Education"

### Managing Career Timeline ⭐ NEW!

#### Add Timeline Entry
1. Edit employee profile
2. Scroll to "Career Timeline" section
3. Click "Add Timeline Entry"
4. Enter:
   - Start Date (required)
   - End Date (optional - leave blank for ongoing)
   - Project Title (required)
   - Status (Completed/In Progress/On Hold)
   - Description (required)
   - Tags (optional - choose from suggestions or create custom)
5. Click "Add Entry"

#### Overlap Detection
- When adding a timeline entry, overlaps are automatically detected
- Warning appears showing concurrent projects
- Example: "🔄 Concurrent with 2 other projects"
- Lists all overlapping projects with date ranges

#### Viewing Timeline
- Timeline appears on employee detail page
- Color-coded status indicators:
  - 🟢 Green = Completed
  - 🔵 Blue = In Progress
  - ⚫ Gray = On Hold
- Overlapping projects show amber indicator
- Project duration displayed in months
- Tags visible for each entry

### Using Analytics

#### View Analytics
1. Click "Analytics" tab
2. View all charts and insights
3. Use department filter to analyze specific teams

#### Filter by Department
1. In Analytics tab, use department dropdown
2. Select department
3. All charts update to show filtered data

#### Export Analytics
1. In Analytics tab, click "Export Analytics"
2. CSV file downloads with all metrics
3. Open in Excel or Google Sheets

### Skills Catalog

#### Add Skill
1. Click "Skills" tab
2. Click "Add Skill"
3. Enter skill name and select category
4. Click "Add Skill"

#### Edit/Delete Skill
1. Click "Skills" tab
2. Find skill in list
3. Click edit or delete icon
4. Confirm action

### Education Catalog

#### Add Education Type
1. Click "Education" tab
2. Click "Add Education"
3. Fill in details
4. Click "Add Education"

---

## 🌐 Deployment

This application is production-ready and optimized for Vercel deployment.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Manual Deployment

See the comprehensive [**Deployment Guide**](./docs/DEPLOYMENT.md) for detailed step-by-step instructions including:

- Prerequisites and setup
- GitHub repository creation
- Vercel deployment (Dashboard and CLI)
- Configuration options
- Custom domain setup
- Troubleshooting
- Post-deployment testing checklist

### Post-Deployment

After deploying, follow the [**Post-Deployment Checklist**](./docs/POST_DEPLOYMENT_CHECKLIST.md) to verify all features work correctly in production.

---

## 📁 Project Structure

```
sqc employee database/
├── docs/
│   ├── DEPLOYMENT.md              # Deployment guide
│   └── POST_DEPLOYMENT_CHECKLIST.md  # Testing checklist
├── public/                        # Static assets
├── src/
│   ├── components/
│   │   ├── analytics/            # Analytics charts
│   │   ├── common/               # Reusable components
│   │   ├── dashboard/            # Dashboard widgets
│   │   ├── education/            # Education components
│   │   ├── employees/            # Employee components
│   │   ├── layout/               # Layout components
│   │   └── skills/               # Skills components
│   ├── context/
│   │   └── AppContext.jsx        # Global state management
│   ├── utils/
│   │   ├── analytics.js          # Analytics calculations
│   │   ├── timeline.js           # Timeline utilities ⭐ NEW!
│   │   ├── storage.js            # LocalStorage wrapper
│   │   ├── validators.js         # Form validation
│   │   ├── csvExport.js          # CSV export utilities
│   │   └── seedData.js           # Sample data
│   ├── constants/
│   │   └── index.js              # App constants
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # TailwindCSS configuration
├── vercel.json                   # Vercel deployment config
├── vite.config.js                # Vite configuration
└── README.md                     # This file
```

---

## 🎯 Key Features for Directors

### Resource Management
- **Concurrent Project Tracking**: See which employees are juggling multiple projects
- **Overlap Detection**: Identify potential resource overload
- **Project Duration**: Track how long projects take
- **Status Visibility**: Quick view of completed vs in-progress work

### Team Analytics
- **Skills Gap Analysis**: Identify missing or under-represented skills
- **Department Insights**: Compare skills and education across departments
- **Education Tracking**: Understand team education levels
- **Proficiency Distribution**: See skill expertise levels

### Planning & Reporting
- **CSV Export**: Export all data for external reporting
- **Visual Analytics**: Share charts in presentations
- **Timeline Visualization**: Show project history and planning
- **Tag-Based Organization**: Categorize projects for better insights

---

## 🔒 Data Privacy & Security

- **Client-Side Only**: No data sent to external servers
- **LocalStorage**: All data stored in user's browser
- **No Authentication Required**: Internal tool for trusted users
- **HTTPS**: Secure when deployed on Vercel
- **Private Repository**: Keep GitHub repo private for company data

---

## 🐛 Known Limitations

- Data is stored in browser localStorage (not shared across devices)
- No multi-user collaboration (each user has their own data)
- No real-time sync between users
- Export limited to CSV format
- Maximum localStorage size varies by browser (~5-10MB)

---

## 🚧 Future Enhancements

Potential features for future versions:

- [ ] Backend API integration for multi-user support
- [ ] User authentication and authorization
- [ ] Real-time collaboration
- [ ] Advanced filtering and sorting
- [ ] Performance reviews integration
- [ ] Goal tracking
- [ ] Document attachments
- [ ] Email notifications
- [ ] Advanced reporting with PDF export
- [ ] Dark mode
- [ ] Horizontal Gantt chart view for timeline
- [ ] Timeline filtering by status/tags
- [ ] Skills recommendations based on role

---

## 🤝 Contributing

This is an internal SQC project. For contributions or bug reports:

1. Create a branch from `main`
2. Make your changes
3. Test thoroughly
4. Submit pull request with description
5. Request review from team lead

---

## 📝 License

Copyright © 2024 SQC Technology Ltd. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 📞 Support

For issues, questions, or feature requests:

- Create an issue in GitHub repository
- Contact IT support team
- Email: support@sqc.com

---

## 🙏 Acknowledgments

Built with:
- React team for amazing framework
- Vercel for seamless deployment
- Recharts for beautiful visualizations
- TailwindCSS for rapid styling

---

**Made with ❤️ by the SQC Development Team**

Last Updated: January 2026
Version: 1.0.0
