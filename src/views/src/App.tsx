import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './components/MainPage'; // Adjust the path if necessary
import SignIn from './components/SignIn'; // Adjust the path if necessary
import SignUp from './components/SignUp'; // Adjust the path if necessary
import DrugTable from './components/DrugTable';
import DrugImageTable from './components/DrugImageTable';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/agentMainPage" element={<MainPage />} />
        <Route path="/adminMainPage" element={<MainPage />} />
        <Route path="/drugs" element={<DrugTable />} /> 
        <Route path="/drug-images" element={<DrugImageTable />} />

      </Routes>
    </Router>
  );
};

export default App;
