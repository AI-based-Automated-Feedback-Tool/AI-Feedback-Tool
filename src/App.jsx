import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Components/MainPage';
import LogInPage from './Components/LogInPage';
import SignInPage from './Components/signInPage';
import StudentDashboard from './Components/StudentDashboard';
import ProtectedRoute from './Components/ProtectedRoute';
import TeacherDashboard from "./Components/TearcherDashboard"
import ConfigureExam from './Components/ConfigureExam';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/logIn" element={<LogInPage/>} />
        <Route path="/register" element={<SignInPage/>} />
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route index element={<StudentDashboard />} />
        </Route>        <Route path="/configure-exam" element={<ConfigureExam />} />       

        <Route path="/dashboard/teacher" element={<ProtectedRoute />}>
          <Route index element={<TeacherDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;