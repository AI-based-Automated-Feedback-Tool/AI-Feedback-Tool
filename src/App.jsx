import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./Components/StudentsComponents/MainPage";
import LogInPage from "./Components/LogInPage";
import SignInPage from "./Components/signInPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import ConfigureExam from "./Components/ConfigureExam/ConfigureExam";
import TeacherLayout from "./layouts/TeacherLayout";
import TaskPage from "./Components/StudentsComponents/taskPages/TaskPage.jsx";
import Courses from "./Components/StudentsComponents/Courses";
import TeacherCourses from "./Components/TeachersComponents/TeacherCourses";
import CreateMcqQuestionsContent from "./Components/CreateQuestions/CreateMcqQuestions/CreateMcqQuestionsContent.jsx";
import ExamsPage from "./Components/StudentsComponents/ExamsPage";
import Profile from "./Components/Profile";
import CourseExamsPage from "./Components/TeachersComponents/CourseExamsPage";
import ProfilePage from "./Components/TeachersComponents/ProfilePage";
import StudentLayout from "./Components/StudentsComponents/StudentLayout";
import { UserProvider, UserContext } from "./Context/userContext.jsx";
import TeacherReportContent from "./Components/TeacherReport/TeacherReportContent.jsx";
import Result from "./Components/StudentsComponents/Result.jsx";
import AIFeedbackPage from "./Components/TeachersComponents/AIFeedback/AIFeedbackPage.jsx";
import AIFeedbackPage_Code from "./Components/TeachersComponents/AIFeedback/AIFeedbackPage_Code.jsx";
import AIFeedbackPage_Essay from "./Components/TeachersComponents/AIFeedback/AIFeedbackPage_Essay.jsx";
import { CourseProvider } from "./Context/courseContext.jsx";
import { ExamProvider } from "./Context/examContext.jsx";
import { TaskProvider } from "./Context/taskContext.jsx";
import Review from "./Components/StudentsComponents/Review.jsx";
import { ReviewProvider } from "./Context/ReviewContext.jsx";
import FeedbackSelector from "./Components/TeachersComponents/AIFeedback/FeedbackSelector.jsx";
import PromptSelector from "./Components/TeachersComponents/AIFeedback/PromptSelector.jsx";
import CreateQuestions from "./Components/CreateQuestions/CreateQuestions.jsx";
import { ResultProvider } from "./Context/ResultContext.jsx";
import { useContext } from "react";
import { CodeQuestionsProvider } from "./Context/QuestionsContext/CodeContext.jsx";
import CodeQuestions from "./Components/StudentsComponents/taskPages/CodeQuestions.jsx";
import { ApiCallCountProvider } from './Context/ApiCallCountContext';
import RegisterCourseContent from "./Components/registerCourse/registerCourseContent.jsx";
import ExamsContent from "./Components/Exams/ExamsContent.jsx";

//  Essay Context and List
import { EssayQuestionsProvider } from './Context/QuestionsContext/EssayContext.jsx';
import EssayQuestionsList from './Components/StudentsComponents/taskPages/EssayQuestionsList.jsx';


function AppContent() {
  //get user id from userContext
  const { userId } = useContext(UserContext);

  return (
    <ApiCallCountProvider>
      <CourseProvider>
        <ExamProvider>
          <TaskProvider>
            <ResultProvider studentId={userId}>
            <CodeQuestionsProvider>
             <EssayQuestionsProvider> {/*  Essay Context Provider */}
              <Router>
                <Routes>
                  {/*Login and registration and main page route */}
                  <Route path="/" element={<MainPage />} />
                  <Route path="/logIn" element={<LogInPage />} />
                  <Route path="/register" element={<SignInPage />} />
                  <Route path="/configure-exam" element={<ConfigureExam />} />
                  {/*Teachers route */}
                  <Route path="/teacher" element={<ProtectedRoute />}>
                    <Route element={<TeacherLayout />}>
                      <Route index element={<TeacherCourses />} />
                      <Route path="exams" element={<ConfigureExam />} />
                      <Route path="exams/:examId/ai-feedback" element={<AIFeedbackPage />} />
                      <Route path="exams/:examId/ai-feedback-code" element={<AIFeedbackPage_Code />} />
                      <Route path="exams/:examId/ai-feedback-essay" element={<AIFeedbackPage_Essay />} />
                      <Route path="ai-feedback" element={<FeedbackSelector />} />
                      <Route path="exams/:examId/prompt-selector" element={<PromptSelector />} />
                      <Route path="exams/:examId/questions/:questionType" element={<CreateQuestions />} />
                      <Route path="courses/:course_id/exams" element={<CourseExamsPage />} />
                      <Route path="courses/:course_id/exams/:examId" element={<ExamsContent />} />
                      <Route path="profile" element={<ProfilePage />} />
                      <Route path="registerCourse" element={<RegisterCourseContent />} />
                      <Route path="reports" element={<TeacherReportContent />} />
                    </Route>
                  </Route>
                  {/*students route */}
                  <Route path="/dashboard" element={<ProtectedRoute />}>
                    <Route path="task/:id" element={<TaskPage />} />
                    <Route path="code/:id" element={<CodeQuestions/>} />
                     {/*  Added EssayQuestionsList Route */}
                    <Route path="essay/:id" element={<EssayQuestionsList />} />
                  </Route>
                  <Route
                    path="/student/courses/:userId"
                    element={<ProtectedRoute />}
                  >
                    <Route element={<StudentLayout />}>
                      <Route index element={<Courses />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="results" element={<Result />} />
                      <Route path=":courseId/exams" element={<ExamsPage />} />
                      <Route
                        path=":courseId/exams/reviews/:submissionId"
                        element={
                          <ReviewProvider>
                            <Review />
                          </ReviewProvider>
                        }
                      />
                    </Route>
                  </Route>
                </Routes>
              </Router>
              </EssayQuestionsProvider> {/*  Essay Context Provider */}
              </CodeQuestionsProvider>
            </ResultProvider>
          </TaskProvider>
        </ExamProvider>
      </CourseProvider>
    </ApiCallCountProvider>  
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;