import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import EditBlog from './pages/EditBlog';
import AddBlog from './pages/AddBlog';



const App = () => {

  return (
    <Router>
      <Routes>
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
      <Route path="/blog/edit/:id" element={<PrivateRoute><EditBlog /></PrivateRoute>} />
      <Route path="/blog/create" element={<PrivateRoute><AddBlog /></PrivateRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
