import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Pages/LoginPage/Login';
import Register from './Pages/RegisterPage/Register';
import NotFound from './Pages/LoginPage/Login'; 
import Feed from './Pages/FeedPage/Feed';
import FollowingUsers from './Pages/FollowingUsersPage/FollowingUsers';
import Logout from './Components/Logout';
import DogsTips from './Pages/DogsTipsPage/DogsTips';
import DogParks from './Pages/DogParksPage/DogParks';
import ReadMe from './Pages/ReadMe/ReadMe';
import Admin from './Pages/AdminPage/Admin';
import './App.css'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/FeedPage" element={<Feed />} />
        <Route path="/FollowingUsersPage" element={<FollowingUsers />} />
        <Route path="/Logout" element={<Logout />} />
        <Route path="/DogsTipsPage" element={<DogsTips />} />
        <Route path='/DogParksPage' element={<DogParks />} />
        <Route path='/ReadMe' element={<ReadMe />} />
        <Route path='/AdminPage' element={<Admin />} />        
        <Route path="*" element={<NotFound />} /> 
      </Routes>
    </Router>
  );
}

export default App;
