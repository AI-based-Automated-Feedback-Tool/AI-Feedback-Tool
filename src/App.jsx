import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Components/MainPage';
import LogInPage from './Components/LogInPage';
import SignInPage from './Components/signInPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/logIn" element={<LogInPage/>} />
        <Route path="/register" element={<SignInPage/>} />

      </Routes>
    </Router>
  );
}

export default App;