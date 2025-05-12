# User Stories

## Authentication
- As a teacher, I want to log in securely using GitHub OAuth so that I can access the platform.
- As a teacher, I want my role to be recognized after login so that I can access instructor features.
- As a student, I want to register or log in using email/password or OAuth so that I can access my assignments.
- As a system, I want to prevent unauthorized users from accessing admin routes.

## GitHub Integration
- As a teacher, I want to fetch student repositories using the GitHub API so that I can view submitted work.
- As a teacher, I want to view the file structure of student submissions so I can choose relevant files for review.
- As a teacher, I want to select code files for analysis so that only key code is sent to the AI.

## Task Configuration
- As a teacher, I want to schedule release and deadline dates for tasks.
- As a teacher, I want to set questions, answers, and correct answers using an intuitive and attractive UI, so that I can automate exam answer correction and streamline the test creation process.

## Timed Exams
- As a student, I want to take timed assignments so that I am assessed under exam conditions.
- As a teacher, I want to set timers for exams and assignments so that submissions are time-bound.

## Focus Tracking
- As a teacher, I want to monitor browser tab activity during the test so I can detect focus loss or potential cheating.
- As a system, I want to warn students when they switch tabs during the test.

## AI Feedback Engine
- As a teacher, I want the system to analyze code using an AI model so that I can understand the student's code quality.
- As a teacher, I want the AI to identify common errors in student submissions so that I can see recurring problems.
- As a teacher, I want the AI to provide suggestions for improvement and alternative solutions so students can learn better.
- As a teacher, I want the feedback to be categorized (e.g., syntax, logic, optimization) so that I can analyze trends.
- As a teacher, I want AI analysis to complete within 5 seconds to maintain productivity.
- As a teacher, I want to select the AI model for evaluating student code so that I can choose the most appropriate feedback mechanism for different types of assignments.

## Feedback UI
- As a teacher, I want to view AI-generated feedback for each student’s code on a clean UI so I can assess their performance quickly.
- As a teacher, I want to highlight strengths and weaknesses in feedback so that students get personalized advice.
- As a student, I want to view my own feedback so I can understand and improve.

## Reporting Tools
- As a teacher, I want to export feedback to a CSV file so that I can keep records or upload to LMS.
- As a teacher, I want to generate a summary report showing the most common mistakes across the class so that I can adjust instruction.
- As a teacher, I want to filter results by task or topic so that I can focus on specific areas.

## Infrastructure
- As a developer, I want to use Docker to containerize the backend so deployment is consistent.
- As a developer, I want a working CI/CD pipeline so code changes are tested and deployed automatically.
- As a developer, I want to store user data, task results, and feedback in Supabase.