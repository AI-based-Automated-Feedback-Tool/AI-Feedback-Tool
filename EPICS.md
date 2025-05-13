# EPICS

## Epics and Related Stories

---

### 1. Authentication and Access Control
- OAuth login for teachers via GitHub
- OAuth or email/password login for students
- Role-based access control after login
- Restrict access to admin/instructor routes

---

### 2. GitHub Integration (Instructor Only)
- Fetch student repositories using GitHub API
- Display file structure of submissions
- Select specific code files for AI analysis

---

### 3. Task Configuration and Scheduling
- Schedule release and deadline dates for tasks
- Create questions and answer sets through UI
- Automate correction setup for multiple-choice and code tasks

---

### 4. Timed Exams and Focus Tracking
- Students take timed exams/assignments
- Teachers configure time limits for tasks
- Track browser tab changes to detect focus loss
- Warn students on tab switching during tests

---

### 5. AI Feedback Engine
- Analyze student code using AI model
- Identify common code errors automatically
- Generate categorized feedback (syntax, logic, optimization)
- Provide suggestions and alternative solutions
- Allow selection of different AI models
- Ensure feedback is returned within 5 seconds

---

### 6. Feedback Interface
- Show AI-generated feedback for each student
- Highlight strengths, weaknesses, and personalized advice
- Students view their own feedback in a clean interface

---

### 7. Reporting and Analytics Tools
- Export feedback to CSV
- Generate class-wide summary reports
- Filter results by task or topic

---

### 8. Project Infrastructure
- Use Docker for backend containerization
- Store users, results, and feedback in Supabase
- Set up CI/CD pipeline for testing and deployment
