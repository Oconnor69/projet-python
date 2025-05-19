import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import BlogManager from './BlogManager';
import AuteurProfile from './AuteurProfile';
import Profile from './Profile';
import Acc from './Acc'; // Assuming acc.js is in the same directory


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Acc />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blog-manager" element={<BlogManager />} />
        <Route path="/auteur/:auteurId" element={<AuteurProfile />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
