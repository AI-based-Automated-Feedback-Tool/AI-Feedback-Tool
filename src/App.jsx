import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./Components/StudentsComponents/MainPage";
import LogInPage from "./Components/LogInPage";
import SignInPage from "./Components/signInPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import ConfigureExam from "./Components/ConfigureExam/ConfigureExam";
import TeacherLayout from "./layouts/TeacherLayout";
import TaskPage from "./Components/StudentsComponents/TaskPage";
import Courses from "./Components/StudentsComponents/Courses";
import TeacherCourses from "./Components/TeachersComponents/TeacherCourses";
import CreateMcqQuestionsContent from "./Components/CreateMcqQuestions/CreateMcqQuestionsContent";
import ExamsPage from "./Components/StudentsComponents/ExamsPage";
import Profile from "./Components/Profile";
import CourseExamsPage from "./Components/TeachersComponents/CourseExamsPage";
import ProfilePage from "./Components/TeachersComponents/ProfilePage";
import StudentLayout from "./Components/StudentsComponents/StudentLayout";
import { UserProvider } from "./Context/userContext.jsx";
import TeacherReportContent from "./Components/TeacherReport/TeacherReportContent.jsx";
import Result from "./Components/StudentsComponents/Result.jsx";
import AIFeedbackPage from './Components/TeachersComponents/AIFeedbackPage';
import { CourseProvider } from "./Context/courseContext.jsx";
import { ExamProvider } from "./Context/examContext.jsx";
import { TaskProvider } from "./Context/taskContext.jsx";
import Review from "./Components/StudentsComponents/Review.jsx";
import { ReviewProvider } from "./Context/reviewContext.jsx";
import FeedbackSelector from './Components/TeachersComponents/FeedbackSelector';

function App() {
  return (
    <UserProvider>
      <CourseProvider>
        <ExamProvider>
        <TaskProvider>

      <Router>
        <Routes>
          {/*Login and registration and main page route */}
          <Route path="/" element={<MainPage />} />
          <Route path="/logIn" element={<LogInPage />} />
          <Route path="/register" element={<SignInPage />} />
          
          <Route path="/configure-exam" element={<ConfigureExam />} />
          <Route path="/teacher" element={<ProtectedRoute />}>
            <Route element={<TeacherLayout />}>
              <Route index element={<TeacherCourses />} />
              <Route path="exams" element={<ConfigureExam />} />
              <Route
                path="exams/:examId/questions/:questionType"
                element={<CreateMcqQuestionsContent />}
              />
              <Route
                path="courses/:course_id/exams"
                element={<CourseExamsPage />}
              />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="students" element={""} />
              <Route path="reports" element={<TeacherReportContent />} />
              <Route path="exams/:examId/ai-feedback" element={<AIFeedbackPage />} />
              <Route path="ai-feedback" element={<FeedbackSelector />} />

            </Route>
          </Route>

          {/*students route */}
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route path="task/:id" element={<TaskPage />} />
          </Route>

          <Route path="/student/courses/:userId" element={<ProtectedRoute />}>
            <Route element={<StudentLayout />}>
              <Route index element={<Courses />} />
              <Route path="profile" element={<Profile />} />
              <Route path="results" element={<Result />} />
              <Route path=":courseId/exams" element={<ExamsPage />} />
              <Route path=":courseId/exams/reviews" element={<ReviewProvider><Review /></ReviewProvider>} />

            </Route>
          </Route>

        </Routes>
      </Router>
      
      </TaskProvider>
      </ExamProvider>
      </CourseProvider>
    </UserProvider>
  );
}

export default App;
