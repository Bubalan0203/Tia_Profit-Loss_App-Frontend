import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { URL } from "../assests/mocData/config";
import Navbar from "./Navbar"
import { Doughnut, Bar } from "react-chartjs-2";
import axios from "axios";
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

// Main Dashboard Component
const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalPaymentPaid, setTotalPaymentPaid] = useState(0);
  const [totalPaymentPending, setTotalPaymentPending] = useState(0);
  const [month, setMonth] = useState("All");
  const [year, setYear] = useState("All");
  const [data, setData] = useState(null);
  const [totals, setTotals] = useState({
    collection: 0,
    totalPayment: 0,
    paymentPaid: 0,
    paymentPending: 0,
  });
  const [error, setError] = useState("");
  const [vipFranchiseData, setVipFranchiseData] = useState([]); // Data for VIP Franchise
  const [vipFranchiseTotals, setVipFranchiseTotals] = useState({
    collection: 0,
    totalPayment: 0,
    paymentPaid: 0,
    paymentPending: 0,
  });
  const fetchFranchiseData = async () => {
    try {
      const response = await fetch(
        `${URL}/vipfranchiseupload/checkRecord?month=${month}&year=${year}`
      );
      const result = await response.json();
  
      if (response.ok && result.records) {
        setVipFranchiseData(result.records);
  
        // Calculate totals
        const calculatedTotals = result.records.reduce(
          (acc, record) => {
            acc.collection += record.totals.collection;
            acc.totalPayment += record.totals.totalPayment;
            acc.paymentPaid += record.totals.paymentPaid;
            acc.paymentPending += record.totals.paymentPending;
            return acc;
          },
          {
            collection: 0,
            totalPayment: 0,
            paymentPaid: 0,
            paymentPending: 0,
          }
        );
        setVipFranchiseTotals(calculatedTotals);
      } else {
        setVipFranchiseData([]);
        setVipFranchiseTotals({
          collection: 0,
          totalPayment: 0,
          paymentPaid: 0,
          paymentPending: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching VIP Franchise data:", err);
      setVipFranchiseData([]);
      setVipFranchiseTotals({
        collection: 0,
        totalPayment: 0,
        paymentPaid: 0,
        paymentPending: 0,
      });
    }
  };
  
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${URL}/vipdata/checkRecord?month=${month}&year=${year}`
      );
      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format (not JSON)");
      }

      const result = await response.json();
      if (response.ok) {
        setData(result);

        // Calculate totals
        const calculatedTotals = result.reduce(
          (acc, record) => {
            acc.collection += record.totals.collection;
            acc.totalPayment += record.totals.totalPayment;
            acc.paymentPaid += record.totals.paymentPaid;
            acc.paymentPending += record.totals.paymentPending;
            return acc;
          },
          {
            collection: 0,
            totalPayment: 0,
            paymentPaid: 0,
            paymentPending: 0,
          }
        );
        setTotals(calculatedTotals);
      } else {
        setError(result.message || "Failed to fetch data");
        setData([]);
        setTotals({
          collection: 0,
          totalPayment: 0,
          paymentPaid: 0,
          paymentPending: 0,
        });
      }
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error("Error fetching stats:", err);
      setData([]);
      setTotals({
        collection: 0,
        totalPayment: 0,
        paymentPaid: 0,
        paymentPending: 0,
      });
    }
  };

  const [CompanyData, setCompanyData] = useState([]); // Data for VIP Franchise
  const [CompanyDataTotals, setCompanyDataTotals] = useState({
    collection: 0,
    totalPayment: 0,
    paymentPaid: 0,
    paymentPending: 0,
  });

  const fetchCompanyData = async () => {
    try {
      const response = await fetch(
        `${URL}/companydata/checkRecord?month=${month}&year=${year}`
      );
      const result = await response.json();
  
      if (response.ok && Array.isArray(result)) {
        setCompanyData(result); // Correctly update CompanyData
  
        // Calculate totals for company revenue
        const calculatedTotals = result.reduce(
          (acc, record) => {
            // Ensure you're accessing the correct fields within each record
            acc.collection += record.totals.courseFee || 0;  // Corrected the field name here
            acc.totalPayment += record.totals.companyRevenue || 0; // Correct field
            acc.paymentPaid += record.totals.paymentPaid || 0;
            acc.paymentPending += record.totals.paymentPending || 0;
            return acc;
          },
          {
            collection: 0,
            totalPayment: 0,
            paymentPaid: 0,
            paymentPending: 0,
          }
        );
  
        setCompanyDataTotals(calculatedTotals); // Correctly update CompanyDataTotals
      } else {
        setCompanyData([]); // Reset company data if response is not an array
        setCompanyDataTotals({
          collection: 0,
          totalPayment: 0,
          paymentPaid: 0,
          paymentPending: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching company data:", err);
      setCompanyData([]); // Reset company data on error
      setCompanyDataTotals({
        collection: 0,
        totalPayment: 0,
        paymentPaid: 0,
        paymentPending: 0,
      });
    }
  };
  



  useEffect(() => {
    fetchData();
    fetchFranchiseData();
    fetchFranchiseData();
    fetchCompanyData(); // Ensure this call is present
  }, [month, year]);
  useEffect(() => {
    fetchSalesData();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [salesData, month, year]);

  const fetchSalesData = () => {
    axios
      .get(`${URL}/franchise`)
      .then((response) => {
        setSalesData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sales data:", error);
      });
  };

  const calculateTotals = () => {
    let filteredData = salesData;

    if (month !== "All" || year !== "All") {
      filteredData = salesData.map((franchise) => {
        const filteredProducts = franchise.products.filter((product) => {
          const productDate = new Date(product.addedDate);
          const productMonth = productDate.toLocaleString("default", { month: "long" });
          const productYear = productDate.getFullYear().toString();

          const matchesMonth = month === "All" || productMonth === month;
          const matchesYear = year === "All" || productYear === year;

          return matchesMonth && matchesYear;
        });

        const filteredRecords = franchise.financialRecords?.filter((record) => {
          const matchesMonth = month === "All" || record.month === month;
          const matchesYear = year === "All" || record.year.toString() === year;

          return matchesMonth && matchesYear;
        });

        return {
          ...franchise,
          products: filteredProducts,
          financialRecords: filteredRecords,
        };
      });
    }

    const totalSales = filteredData.reduce((total, franchise) => {
      const productSales = franchise.products.reduce((sum, product) => sum + parseFloat(product.total), 0);
      const recordSales = franchise.financialRecords?.reduce((sum, record) => sum + record.royaltyAmount, 0) || 0;
      return total + productSales + recordSales;
    }, 0);

    const totalPaid = filteredData.reduce((total, franchise) => {
      const productPaid = franchise.products.reduce((sum, product) => sum + (product.paymentPaid || 0), 0);
      const recordPaid = franchise.financialRecords?.reduce((sum, record) => sum + record.amountPaid, 0) || 0;
      return total + productPaid + recordPaid;
    }, 0);

    const totalPending = totalSales - totalPaid;

    setTotalSales(totalSales);
    setTotalPaymentPaid(totalPaid);
    setTotalPaymentPending(totalPending);
  };



  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <DashboardContainer>
      <DashboardHeadingContainer>
        <DashboardHeading>Dashboard</DashboardHeading>

       {/* Filters */}
       {/* Year and Month Filter */}
       <FilterContainer>
          <FilterSelect value={month} onChange={handleMonthChange}>
            <option value="All">All Months</option>
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

          <FilterSelect value={year} onChange={handleYearChange}>
            <option value="All">All Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </FilterSelect>
        </FilterContainer>
      </DashboardHeadingContainer>

      <h1>VIP Business Stats</h1>
<StatsSection>
  {Object.entries(totals).map(([key, value]) => (
    <StatCard key={key}>
      <StatLabel>{key.replace(/([A-Z])/g, " $1")}</StatLabel>
      <StatValue>₹{value}</StatValue>
    </StatCard>
  ))}
</StatsSection>

<h1>VIP Franchise Business Stats</h1>
<StatsSection>
  {Object.entries(vipFranchiseTotals).map(([key, value]) => (
    <StatCard key={key}>
      <StatLabel>{key.replace(/([A-Z])/g, " $1")}</StatLabel>
      <StatValue>₹{value}</StatValue>
    </StatCard>
  ))}
</StatsSection>

<h1>Company Business Stats</h1>
<StatsSection>
  {Object.entries(CompanyDataTotals).map(([key, value]) => (
    <StatCard key={key}>
      <StatLabel>{key.replace(/([A-Z])/g, " $1")}</StatLabel>
      <StatValue>₹{value.toLocaleString()}</StatValue> {/* Format numbers */}
    </StatCard>
  ))}
</StatsSection>



<h1>Franchise Sales Stats</h1>
      <StatsSection>
        <StatCard>
          <StatLabel>Total Sales</StatLabel>
          <StatValue>₹{totalSales.toLocaleString()}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Payment Paid</StatLabel>
          <StatValue>₹{totalPaymentPaid.toLocaleString()}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Payment Pending</StatLabel>
          <StatValue>₹{totalPaymentPending.toLocaleString()}</StatValue>
        </StatCard>
      </StatsSection>

<h1>Other  Stats</h1>
      <StatsSection>  
  <StatCard>
    <StatLabel>Total  Other Sales</StatLabel>
    <StatValue>₹61999</StatValue>
  </StatCard>
  <StatCard>
    <StatLabel>Total  Other Expense</StatLabel>
    <StatValue>₹61999</StatValue>
  </StatCard>
</StatsSection>

<h1>P & L Stats</h1>
      <StatsSection>  
  <StatCard>
    <StatLabel>Total  Income</StatLabel>
    <StatValue>₹61999</StatValue>
  </StatCard>
  <StatCard>
    <StatLabel>Total  Expense</StatLabel>
    <StatValue>₹61999</StatValue>
  </StatCard>
</StatsSection>

      <GraphSection>
        <GraphItem>
          <GraphTitle>P & L </GraphTitle>
          <ChartContainer>
            <Doughnut data={roundData} options={chartOptions} />
          </ChartContainer>
        </GraphItem>
        <GraphItem>
          <GraphTitle>Profit & Loss</GraphTitle>
          <ChartContainer>
            <Bar data={centerBarData} options={chartOptions} />
          </ChartContainer>
        </GraphItem>
      </GraphSection>

      <BackButton onClick={handleBackClick}>Back</BackButton>
    </DashboardContainer>
  );
};

export default Dashboard;


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
