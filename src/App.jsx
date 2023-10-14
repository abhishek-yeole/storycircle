import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from './Components/LandingPage/Landing';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import Forgot from './Components/Auth/Forgot';
import Room from './Components/Room/Room';
import Lobby from './Components/Lobby/Lobby';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/room/:code" element={<Room />} />
        <Route path="/lobby" element={<Lobby />} />
      </Routes>
    </Router>
  );
}

export default App;
