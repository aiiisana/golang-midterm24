import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import TaskList from './components/TaskList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users/:userId/tasks" element={<TaskList />} />
        <Route path="/" element={<Login />} /> 
        </Routes>
    </Router>
  );
}

export default App;