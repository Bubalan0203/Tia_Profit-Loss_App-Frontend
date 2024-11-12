import React from "react";
import styled from "styled-components";
import Navbar from "./Navbar"
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Styled Components for Dashboard
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: #1E1E1E;
`;

const DashboardHeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const DashboardHeading = styled.h1`
  font-size: 2.5rem;
  color: #fff;
  margin: 0;
  text-align: center;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
   background-color: #311c31;
   color:white;

`;

const StatsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatCard = styled.div`
  flex: 1;
  text-align: left; /* Align text to the left */
  padding: 1rem;
  font-size: 1rem; /* Default font size */
  color: #fff;
  background-image: linear-gradient(to bottom, #1c141c,#5b163b);
  border-radius: 10px;
  font-weight: bold;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;

  /* Style for the rupee symbol */
  &::after {
    content: "₹";
    font-size: 6rem; /* Adjust as needed */
    color: rgba(255, 255, 255, 0.3); /* Lightly transparent */
    position: absolute;
        right: 2%;
  }

  /* Media query for mobile */
  @media (max-width: 768px) {
    font-size: 0.8rem; /* Smaller text for mobile */
  }
`;

const StatLabel = styled.div`
  font-size: 1rem; /* Smaller text for the label */
  color: rgba(255, 255, 255, 0.7); /* Slightly muted label color */
`;

const StatValue = styled.div`
  font-size: 2.5rem; /* Larger text for the value */
  font-weight: bold;
  color: #fff;
`;



const StatBoard = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 1rem;
`;

const StatBoardItem = styled.div`
  text-align: center;
  padding: 0.75rem;
  font-size: 1.2rem;
  color: #fff;
  background-color: #2D2D2D;
  border-radius: 10px;
  font-weight: bold;
`;

const GraphSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
`;

const GraphItem = styled.div`
  background-color: #28282d;
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow effect */
  transition: all 0.3s ease-in-out; /* Smooth transition for hover effect */
  position: relative;

  &:hover {
    transform: translateY(-5px); /* Lift effect on hover */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* Slightly larger shadow on hover */
  }

  /* Optional: Add gradient or border effect on hover */
  &:hover::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 15px;
   
    opacity: 0.1;
  }
`;

const GraphTitle = styled.h3`
  margin-bottom: 1.2rem;
  font-size: 1.4rem;
  font-weight: bold;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px; /* Set a fixed height for a consistent look */
  position: relative;
`;
// Set responsive options for Chart.js
const chartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: {
        font: {
          size: 14,
          weight: 'bold'
        },
        color: "#fff"
      }
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark background for tooltips
      titleColor: "#fff",
      bodyColor: "#fff",
    },
    title: {
      display: false,
    },
  },
};

const BackButton = styled.button`
  background-color: #FF6347;
  color: white;
  font-size: 1rem;
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: auto;
  max-width: 200px;
  display: block;
  margin: 20px auto 0;

  &:hover {
    background-color: #FF4500;
  }

  &:focus {
    outline: none;
  }
`;

// Main Dashboard Component
const Dashboard = () => {
  const handleBackClick = () => {
    window.history.back();
  };

  // Example data for the Doughnut (Round) chart
  const roundData = {
    labels: ["Red", "Yellow"],
    datasets: [
      {
        data: [300, 100],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  // Example data for the Bar charts
  const barData = {
    labels: ["21-10-2024", "22-10-2024", "23-10-2024", "24-10-2024", "26-10-2024"],
    datasets: [
      {
        label: "VIP",
        backgroundColor: "#f00d88",
        data: [60, 20, 30, 10, 5],
      },
    ],
  };

  // Example data for the Center Bar chart (with two datasets)
  const centerBarData = {
    labels: ["21-10-2024", "22-10-2024", "23-10-2024", "24-10-2024", "26-10-2024"],
    datasets: [
      {
        label: "VIP",
        backgroundColor: "#E57373",
        data: [60, 20, 30, 10, 5],
      },
      {
        label: "Non-VIP",
        backgroundColor: "#81C784",
        data: [40, 60, 45, 80, 65],
      },
    ],
  };

  return (
    <DashboardContainer>
      <DashboardHeadingContainer>
        <DashboardHeading>Dashboard</DashboardHeading>

        {/* Year and Month Filter */}
        <FilterContainer>
          <FilterSelect>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </FilterSelect>

          <FilterSelect>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </FilterSelect>
        </FilterContainer>
      </DashboardHeadingContainer>



      <StatsSection>
  <StatCard>
    <StatLabel>Total Month Business</StatLabel>
    <StatValue>₹61999</StatValue>
  </StatCard>
  <StatCard>
    <StatLabel>Total Month Business</StatLabel>
    <StatValue>₹61999</StatValue>
  </StatCard>
  
  <StatCard>
    <StatLabel>Total Month Business</StatLabel>
    <StatValue>₹61999</StatValue>
  </StatCard>
  <StatCard>
    <StatLabel>Total Month Business</StatLabel>
    <StatValue>₹61999</StatValue>
  </StatCard>
  <StatCard>
    <StatLabel>Total Month Business</StatLabel>
    <StatValue>₹61999</StatValue>
  </StatCard>
</StatsSection>


      <GraphSection>
        <GraphItem>
          <GraphTitle>Round Graph</GraphTitle>
          <ChartContainer>
            <Doughnut data={roundData} options={chartOptions} />
          </ChartContainer>
        </GraphItem>
        <GraphItem>
          <GraphTitle>VIP & Non-VIP</GraphTitle>
          <ChartContainer>
            <Bar data={centerBarData} options={chartOptions} />
          </ChartContainer>
        </GraphItem>
        <GraphItem>
          <GraphTitle>VIP Franchise</GraphTitle>
          <ChartContainer>
            <Bar data={barData} options={chartOptions} />
          </ChartContainer>
        </GraphItem>
      </GraphSection>

      <BackButton onClick={handleBackClick}>Back</BackButton>
    </DashboardContainer>
  );
};

export default Dashboard;