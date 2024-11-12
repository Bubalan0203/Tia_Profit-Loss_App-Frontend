import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import HoDetailsContainer from './components/HoDetailsContainer';
import FranchiseDetailsContainer from './components/FranchiseDetailsContainer';
import VipDetailsContainer from './components/VipDetailsContainer';
import SalesDetailsContainer from './components/SalesDetailsContainer';
import FranchiseSalesContainer from './components/FranchiseSalesContainer';
import { SnackbarProvider } from 'notistack';
import ExpenseDetailContainer from './components/ExpenseDetailsContainer';

const App = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Update window width on resize
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (windowWidth <= 1000) {
        return null; // Return null to render a blank screen on smaller screens
    }

    return (
        <SnackbarProvider maxSnack={3}>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/hosstaff" element={<HoDetailsContainer />} />
                    <Route path="/franchise" element={<FranchiseDetailsContainer />} />
                    <Route path="/vip" element={<VipDetailsContainer />} />
                    <Route path="/sales" element={<SalesDetailsContainer />} />
                    <Route path="/fsales" element={<FranchiseSalesContainer />} />
                    <Route path="/expense" element={<ExpenseDetailContainer />} />
                </Routes>
            </Router>
        </SnackbarProvider>
    );
};

export default App;
