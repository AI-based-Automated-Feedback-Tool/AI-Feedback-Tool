const CodeStyleReview = {
  label: 'Code Style Review',
  prompt: `Evaluate the following student-submitted code for adherence to best practices and clean coding guidelines.

Look at aspects like:
- Naming conventions
- Code structure and formatting
- Use of comments and readability
- Code duplication
- Logic clarity

Then provide:
1. A summary of the code quality.
2. A list of improvements the student can make.
3. Praise for any well-written parts.

Use example references from the code where needed.

Code: [QUESTIONS]
Student Submissions: [SUBMISSIONS]
Expected Answers: [ANSWERS]`
};

export default CodeStyleReview;
