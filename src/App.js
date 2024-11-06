import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';  // Assuming you have a Dashboard component
import HoDetailsContainer from './components/HoDetailsContainer';
import FranchiseDetailsContainer from './components/FranchiseDetailsContainer';
import VipDetailsContainer from './components/VipDetailsContainer';
import SalesDetailsContainer from './components/SalesDetailsContainer';
import FranchiseSalesContainer from './components/FranchiseSalesContainer';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/hosstaff" element={<HoDetailsContainer />} />
                <Route path="/franchise" element={<FranchiseDetailsContainer />} />
                <Route path="/vip" element={<VipDetailsContainer />} />
                <Route path="/sales" element={<SalesDetailsContainer />} />
                <Route path="/fsales" element={<FranchiseSalesContainer/>} />
            </Routes>
        </Router>
    );
};

export default App;
