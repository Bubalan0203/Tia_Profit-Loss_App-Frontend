import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/Navbar';
import styled from 'styled-components';

// Styled-components for Dashboard layout
const DashboardContainer = styled.div`
    display: flex;
    height: 100vh;
`;

const DashboardBody = styled.div`
    flex: 1;
    padding: 20px;
    background-color: #2b2a2f;
    color:#fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;



const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/'); // Redirect to login if no token
        }

        // Simulate fetching user data
        axios
            .get('http://localhost:5000/user', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setUser(res.data); // Assuming API returns user data
            })
            .catch(() => {
                localStorage.removeItem('token');
                navigate('/'); // Redirect if token is invalid
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/'); // Redirect to login after logout
    };

    return (
        <DashboardContainer>
            <NavBar />
            <DashboardBody>
                <h2>Dashboard</h2>
                {user ? (
                    <div>
                        <p>Welcome, {user.email}!</p>
                    </div>
                ) : (
                    <p>Loading user data...</p>
                )}
            </DashboardBody>
        </DashboardContainer>
    );
};

export default Dashboard;
