import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Components/StudentsComponents/MainPage';
import LogInPage from './Components/LogInPage';
import SignInPage from './Components/signInPage';
import StudentDashboard from './Components/StudentsComponents/StudentDashboard';
import ProtectedRoute from './Components/ProtectedRoute';
import ConfigureExam from './Components/ConfigureExam/ConfigureExam';
import TeacherLayout from './layouts/TeacherLayout';
import TaskPage from './Components/StudentsComponents/TaskPage';
import Courses from './Components/StudentsComponents/Courses';
import TeacherCourses from './Components/TeachersComponents/TeacherCourses';
import CreateMcqQuestionsContent from './Components/CreateMcqQuestions/CreateMcqQuestionsContent';
import ExamsPage from './Components/StudentsComponents/ExamsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/logIn" element={<LogInPage/>} />
        <Route path="/register" element={<SignInPage/>} />
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route index element={<StudentDashboard />} />
          <Route path="task/:id" element={<TaskPage />} />
          <Route path="courses/:courseId/exams" element={<ExamsPage />} />
         

        </Route>        
        <Route path="/configure-exam" element={<ConfigureExam />} /> 
        <Route path="/teacher" element={<ProtectedRoute />}>     
          <Route element={<TeacherLayout />}>
            <Route index element={<TeacherCourses />} />
            <Route path="exams" element={<ConfigureExam />} />
            <Route path="exams/:examId/questions" element={<CreateMcqQuestionsContent />} />
            <Route path="courses/:courseId/exams" element={""} />
            <Route path="students" element={""} />
            <Route path="reports" element={""} />

          </Route>
        </Route> 

        <Route path="/student/courses/:userId" element={<ProtectedRoute />}>
          <Route index element={<Courses />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;