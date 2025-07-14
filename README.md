# 🚀 AI Feedback Platform – Smarter Learning & Teaching with AI 🧑‍🎓🧑‍🏫✨

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React + React Native](https://img.shields.io/badge/Frontend-React%20%26%20React%20Native-blue)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-lightgrey)](https://supabase.com)

## 📄 Description

**AI Feedback Platform** is a comprehensive **browser-based web application** built for **students** and **teachers** to streamline **assignments, exams, feedback, and learning** through the power of **Artificial Intelligence**.

---

## 🎯 Key Features

### ✅ For Students:

- Complete weekly assignments and exams including **multiple-choice** and **coding tasks**.
- Receive **instant, personalized feedback** powered by AI, 
- Timed assignments with browser focus tracking
- Access feedback designed to help you **learn, improve, and succeed**.

---

### ✅ For Teachers:

- Monitor and manage student assignments and exams via a **teacher dashboard**.
- Review student performance and AI-generated feedback with **AI assistance**.
- Export Ai feedback as text files for easy sharing and review.
- Generate, configure, and schedule assignments easily.
- All results and interactions are securely stored in **Supabase**.

---

## 🔧 Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **AI Integration:** OpenAI / Cohere / DeepSeek API
- **Database:** Supabase

## 👥 Team

|       Name       |  GitHub Name |                       Role                          |
|------------------|--------------|-----------------------------------------------------|
| Sujeewa Herath   | SampathHM    | Frontend and backend Developer / Project Management |
| Upeksha Chiranthi| upeksha-c    | Frontend and backend Developer / Project Management |
| Archana Ojha     | ojhaarch2054 | Frontend and backend Developer / Project Management |
| Nipuni Kodikara  | t3komu00     | Frontend and backend Developer / Project Management |


## 🔗 APIs Used

We integrated multiple AI APIs to provide personalized feedback, error analysis, and solution suggestions for students' answers.

---

### 1. Cohere API
- **Description:**  
  Cohere focuses on natural language understanding, making it suitable for generating concise feedback, text classification, and summarization.
- **Pros:**
  - Cost-effective for text-focused tasks.
  - Strong in maintaining tone consistency and clarity.
  - Easy to integrate with clear API documentation.
- **Cons:**
  - Limited capabilities for complex code-related tasks.
  - Less effective in multi-step reasoning or advanced technical explanations.

---

### 2. OpenRouter AI
- **Description:**  
  OpenRouter AI provides access to multiple open-source and commercial AI models via a single API interface. It is used for generating personalized and context-aware feedback.
- **Pros:**
  - Flexibility to switch between multiple models (including open-source and advanced models).
  - Pay-as-you-go model cost-effective for small projects.
  - Ideal for natural language tasks and creative text generation.
- **Cons:**
  - Quality depends on the selected model some models may underperform.
  - Less predictable behavior compared to single-provider APIs.

---

### 3. DeepSeek API
- **Description:**  
  DeepSeek AI specializes in code generation, explanation, and problem-solving, making it ideal for programming-related feedback.
- **Pros:**
  - Fast response time.
  - Strong performance on code-related questions and technical answers.
  - Competitive pricing for AI code assistance.
- **Cons:**
  - Sometimes less accurate for abstract or non-technical content.
  - Smaller community and fewer resources for troubleshooting.

---

✅ We selected these AI APIs to balance **quality**, **cost**, and **task suitability**, ensuring the best experience for both students and teachers.


## 🚀 Installation & Setup Guide

This guide walks you through setting up the **Student AI Feedback System** on your local machine. The system consists of:


### ✅ Frontend Setup (React + Vite)

#### Prerequisites:

- Node.js (v18 or higher) ➔ [Download Node.js](https://nodejs.org/)
- npm (comes with Node.js) or yarn
- A Supabase project ➔ [https://supabase.io/](https://supabase.io/)
- AI API Keys:
  - [Cohere](https://cohere.ai/)
  - [OpenRouter AI](https://openrouter.ai/)
  - [DeepSeek](https://deepseek.com/)

#### Steps:

1. **Clone the Frontend Repository:**

   ```bash
   git clone https://github.com/AI-based-Automated-Feedback-Tool/AI-Feedback-Tool.git
   cd frontend-repo
    ```

2. **Install Frontend Dependencies:**

   ```bash
   npm install
   ```
  
3. **Create a `.env` file in the root directory:**

    ```bash
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key    
    ```
  
    Replace the placeholders with your actual API keys and Supabase credentials.


4. **Start the Frontend Server:**

   ```bash
   npm run dev
   ```
  The frontend will be running at `http://localhost:5173`



### ✅ Backend Setup (Node.js + Express)

#### Prerequisites:
- Node.js (v18 or higher) ➔ [Download Node.js](https://nodejs.org/)
- npm (comes with Node.js) or yarn
- A Supabase project ➔ [https://supabase.io/](https://supabase.io/)
- AI API Keys:
  - [Cohere](https://cohere.ai/)
  - [OpenRouter AI](https://openrouter.ai/)
  - [DeepSeek](https://deepseek.com/)
  
#### Steps:
1. **Clone the Backend Repository:**

   ```bash
   git clone https://github.com/AI-based-Automated-Feedback-Tool/AI-Feedback-Tool-Backend.git
    cd backend-repo
    ```

2. **Install Backend Dependencies:**

    ```bash
    npm install
    ```

3. **Create a `.env` file in the root directory:**

    ```bash
    SUPABASE_URL=your_supabase_url
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    COHERE_API_KEY=your_cohere_api_key
    OPENROUTER_API_KEY=your_openrouter_api_key
    DEEPSEEK_API_KEY=your_deepseek_api_key
    OPENAI_API_KEY=your_openai_api_key
    PORT=3000
    ```
    Replace the placeholders with your actual API keys and Supabase credentials.
    
4. **Start the Backend Server:**

    ```bash
    npm run start
    ```
    
    The backend will be running at `http://localhost:3000`
  

---
---

## 🔗 UI Wireframe (Figma)

You can view the UI wireframe here: [Click to open Figma Design](https://www.figma.com/design/pk7MWiVJ9oJxGG89NFyQTW/AI-Powered-Exam---Assignment-Web-App?node-id=1-20&t=79hujBb7N1vTSMNq-1)

---
---

## 👥 User Onboarding Flow (Teacher & Student)

This section explains how both **teachers and students** can sign up, log in, and start using the system.  
Follow the steps below, and refer to the screenshots provided for a visual guide.

---

### 1️⃣ Landing Page – "AI-Based Automated Feedback Tool"

<div align="center"> <img src="./src/assets/Intro_Page.png" alt="Intro Page" width="800"/> </div>


- When you visit `http://localhost:5173`, you will see the **Intro Page**.
- Click the **"Get Started"** button to begin.

---

### 2️⃣ Login Page

<div align="center"> <img src="./src/assets/Login_Page.png" alt="Login Page" width="300"/> </div>

- If you already have an account, enter your **email** and **password** here.
- Click **"Login"** to access your dashboard.
- If you are new, click the **"Sign Up"** link below the login button.

---


### 3️⃣ Sign Up Page

<div align="center"> <img src="./src/assets/SignUp_Page.png" alt="Sign Up Page" width="400"/> </div>

- Fill in the following fields to create an account:
  - **Full Name**
  - **Email**
  - **Password**
  - **Role** ➔ Choose **Teacher** from the dropdown
- Click **"Sign Up"** to register.
- The system will store your role and details securely in Supabase Auth.

---

### 4️⃣ Post-Login Redirection

- After login:
  - If you signed up as a **teacher**, you will be redirected to the **Teacher Dashboard**.
  - If you signed up as a **student**, you will be redirected to the **Student Dashboard**.

✅ Your role is automatically detected based on what you selected during signup.

---

### 🔐 Authentication Notes

- User authentication is handled by **Supabase Auth**.
- The `role` (student/teacher) is stored as user metadata in Supabase and used to control access.
- Unauthorized users cannot access teacher-specific routes.

---

## 👨‍🏫 Teacher Dashboard

The Teacher Dashboard provides a central interface for educators to manage their courses, exams, and student feedback with ease.

<div align="center"> <img src="./src/assets/teacher-dashboard.png" alt="Intro Page" width="800"/> </div>


### 🧩 Features

- **📚 Course Cards**
  - Displays all courses assigned to the teacher.
  - Each course is presented as a clickable card.
  - Cards show:
    - **Course Title**
    - **Course Code**
    - **Brief Description**

- **🧭 Sidebar Navigation**
  - `Dashboard` – Home view showing teacher's courses.
  - `Configure Exam` – Set up exams for selected courses.
  - `Register Course` – Register new courses to the system.
  - `Reports` – View student performance and analytics.
  - `AI Feedback` – Access AI-generated feedback for student answers.
  - `Profile` – Manage teacher profile information.

- **🔝 Top Bar**
  - Profile icon leading to the profile page.
  - Red **Log Out** button to securely exit the dashboard.


### 🎯 Purpose

The Teacher Dashboard ensures that instructors can quickly navigate between their teaching resources, configure exams, register new courses, and leverage AI tools to enhance educational delivery.

---

## 📄 Course Exams Page

When a teacher clicks on a specific course card in the **Teacher Dashboard**, they are navigated to the **Course Exams Page**. This page displays a detailed list of all the exams created under that course.

### 🎯 Purpose

This page enables teachers to:

- View all exams associated with the selected course.
- See exam types (e.g., MCQ, CODE, ESSAY), durations, number of questions, and due dates.
- Manage or create new exams with ease.

### 📘 Example: `JS201 - Advanced JavaScript`

> The page title reflects the selected course (e.g., `JS201 - Advanced JavaScript`), providing context for the listed exams.

### 🧾 Page Preview

<div align="center">
  <img src="./src/assets/course-exams.png" alt="Course Exams Page" width="800"/>
</div>

### 📋 Exam Table Overview

| Field        | Description                                      |
|--------------|--------------------------------------------------|
| **Title**    | Name of the exam (e.g., "Basic JavaScript test") |
| **Type**     | Exam type: `MCQ`, `CODE`, or `ESSAY`             |
| **Duration** | Time allowed for the exam                        |
| **Questions**| Number of questions in the exam                  |
| **Due Date** | Date & time the exam is due                      |

Each row in the table corresponds to one exam under the selected course.

### ➕ Create New Exam

A **"Create New Exam"** button is available in the top-right corner. Clicking it opens a form for adding a new exam to the current course.

---


