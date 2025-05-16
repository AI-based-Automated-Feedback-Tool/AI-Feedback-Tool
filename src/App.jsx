import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Components/MainPage';
import LogInPage from './Components/LogInPage';
import SignInPage from './Components/signInPage';
import StudentDashboard from './Components/StudentDashboard';
import ConfigureExam from './Components/ConfigureExam';
import TeacherLayout from './layouts/TeacherLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/logIn" element={<LogInPage/>} />
        <Route path="/register" element={<SignInPage/>} />
        <Route path="/dashboard" element={<StudentDashboard/>} />
        <Route path="/configure-exam" element={<ConfigureExam />} />      
        <Route path="/teacherProfile"  element={<TeacherLayout/>}/>  

      </Routes>
    </Router>
  );
}

export default App;