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

  VITE_SUPABASE_URL=your_supabase_url
  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

4. **Start the Frontend Server:**

   ```bash
   npm run dev
   ```
  the frontend will be running at `http://localhost:5173`


## 🔗 UI Wireframe (Figma)

You can view the UI wireframe here: [Click to open Figma Design](https://www.figma.com/design/pk7MWiVJ9oJxGG89NFyQTW/AI-Powered-Exam---Assignment-Web-App?node-id=1-20&t=79hujBb7N1vTSMNq-1)
