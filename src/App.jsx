import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Components/StudentsComponents/MainPage';
import LogInPage from './Components/LogInPage';
import SignInPage from './Components/signInPage';
import ProtectedRoute from './Components/ProtectedRoute';
import ConfigureExam from './Components/ConfigureExam/ConfigureExam';
import TeacherLayout from './layouts/TeacherLayout';
import TaskPage from './Components/StudentsComponents/TaskPage';
import Courses from './Components/StudentsComponents/Courses';
import TeacherCourses from './Components/TeachersComponents/TeacherCourses';
import CreateMcqQuestionsContent from './Components/CreateMcqQuestions/CreateMcqQuestionsContent';
import ExamsPage from './Components/StudentsComponents/ExamsPage';
import Profile from './Components/Profile';
import CourseExamsPage from './Components/TeachersComponents/CourseExamsPage';
import ProfilePage from './Components/TeachersComponents/ProfilePage';
import StudentLayout from './Components/StudentsComponents/StudentLayout';
import { UserProvider } from './Context/userContext.jsx';
import TeacherReportContent from './Components/TeacherReport/TeacherReportContent.jsx';

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/logIn" element={<LogInPage />} />
        <Route path="/register" element={<SignInPage />} />
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route path="task/:id" element={<TaskPage />} />
          <Route path="courses/:courseId/exams" element={<ExamsPage />} />
        </Route>
        <Route path="/configure-exam" element={<ConfigureExam />} />
        <Route path="/teacher" element={<ProtectedRoute />}>
          <Route element={<TeacherLayout />}>
            <Route index element={<TeacherCourses />} />
            <Route path="exams" element={<ConfigureExam />} />
            <Route
              path="exams/:examId/questions"
              element={<CreateMcqQuestionsContent />}
            />
            <Route
              path="courses/:course_code/exams"
              element={<CourseExamsPage />}
            />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="students" element={""} />
            <Route path="reports" element={<TeacherReportContent />} />
          </Route>
        </Route>

        <Route path="/student/courses/:userId" element={<ProtectedRoute />}>
          <Route element={<StudentLayout />}>
            <Route index element={<Courses />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
