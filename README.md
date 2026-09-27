# CodeVault

### Academic Code, Lab & DSA Management System

CodeVault is a dynamic web application designed to organize and manage academic laboratory experiments, DSA problems, and reusable programming code in one place.

The project was developed as an individual submission for **CCA 2 – Cloud Computing and DevOps (CSE30040)**, with a focus on Git, automated testing, Docker, CI/CD and cloud deployment.

---

## 🌐 Links

- **GitHub Repository:** https://github.com/sudo-ark/CodeVault
- **Live Application:** https://codevault-qo7o.onrender.com
- **GitHub Actions:** https://github.com/sudo-ark/CodeVault/actions
- **Health Check:** https://codevault-qo7o.onrender.com/health

---

## ✨ Features

### 📊 Dashboard
- Displays live counts of:
  - Laboratory experiments
  - DSA problems
  - Archived code
- Displays recent activity.

### 🧪 Lab Manager
- Add laboratory experiments
- View experiments
- Search and filter experiments
- Validate submitted data
- Manage experiment records

### 🧠 DSA Tracker
- Store DSA problems
- Track:
  - Problem title
  - Topic
  - Difficulty
  - Platform
  - Programming language
  - Approach
  - Solution
  - Time complexity
  - Space complexity
  - Solved status
- Search and filter problems
- Edit and delete records

### 💻 Code Archive
- Store reusable academic code
- Search and filter code
- Edit existing records
- Delete records

### ❤️ Health Check
The application provides a health-check endpoint:

```text
GET /health
