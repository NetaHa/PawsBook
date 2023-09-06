import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Pages/LoginPage/Login';
import Register from './Pages/RegisterPage/Register';
import NotFound from './Pages/LoginPage/Login'; // Optional 404 component
import Feed from './Pages/FeedPage/Feed';
import FollowingUsers from './Pages/FollowingUsersPage/FollowingUsers';
import Logout from './Components/Logout';



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
        <Route path="*" element={<NotFound />} /> {/* This is a catch-all route */}
      </Routes>
    </Router>
  );
}

export default App;
