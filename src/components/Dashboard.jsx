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
  const [totalSale, setTotalSale] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [saleData, setSaleData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [othExpenses, setothExpenses] = useState(0);
  const [hosalaryExpenses, sethosalaryExpenses] = useState(0);
  const [hoData, setHoData] = useState([]);
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


  useEffect(() => {
    const fetchSaleData = async () => {
        try {
            const response = await fetch(`${URL}/sales`);
            const data = await response.json();
            setSaleData(data);
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
    };

    fetchSaleData();
}, []);

// Fetch expenses data
useEffect(() => {
    const fetchExpenseData = async () => {
        try {
            const response = await fetch(`${URL}/fsales`);
            const data = await response.json();
            setExpenseData(data);
        } catch (error) {
            console.error('Error fetching expenses data:', error);
        }
    };

    fetchExpenseData();
}, []);

useEffect(() => {
  // Fetch data from the backend API
  axios.get(`${URL}/hostaff`) // Update with your actual endpoint
    .then((response) => setHoData(response.data))
    .catch((error) => console.error("Error fetching data:", error));
}, []);

useEffect(() => {
  const filterAndCalculateTotals = () => {
    let filteredSales = [...saleData];
    let filteredExpenses = [...expenseData];
    let hoTotalSalary = 0;

    // Month and Year Mapping
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const monthIndex = month !== "All" ? monthNames.indexOf(month) : null;
    const selectedYear = year !== "All" ? parseInt(year) : null;

    // Calculate the filtered total salary from HO data
    if (hoData && hoData.length > 0) {
      hoTotalSalary = hoData.reduce((total, ho) => {
        // Filter the salary array by month and year
        const filteredSalary = ho.salary.filter((salaryItem) => {
          const salaryDate = new Date(salaryItem.date);
          const salaryMonth = salaryDate.getMonth(); // 0-based month index
          const salaryYear = salaryDate.getFullYear();

          const matchesMonth = monthIndex === null || salaryMonth === monthIndex;
          const matchesYear = selectedYear === null || salaryYear === selectedYear;

          return matchesMonth && matchesYear;
        });

        // Sum up the filtered salary totals
        const salaryTotal = filteredSalary.reduce((sum, salaryItem) => sum + (salaryItem.total || 0), 0);
        return total + salaryTotal;
      }, 0);
    }

    // Filter sales and expenses by month and year
    if (month !== "All") {
      filteredSales = filteredSales.filter((sale) => {
        const saleMonth = new Date(sale.createdAt).getMonth();
        return saleMonth === monthIndex;
      });

      filteredExpenses = filteredExpenses.filter((expense) => {
        const expenseMonth = new Date(expense.createdAt).getMonth();
        return expenseMonth === monthIndex;
      });
    }

    if (year !== "All") {
      filteredSales = filteredSales.filter((sale) => {
        const saleYear = new Date(sale.createdAt).getFullYear();
        return saleYear === selectedYear;
      });

      filteredExpenses = filteredExpenses.filter((expense) => {
        const expenseYear = new Date(expense.createdAt).getFullYear();
        return expenseYear === selectedYear;
      });
    }

    // Calculate total sales and expenses
    const totalSale = filteredSales.reduce((total, sale) => total + parseFloat(sale.total), 0);
    const totalExpense = filteredExpenses.reduce((total, expense) => total + parseFloat(expense.total), 0) ;
    const othexpense=filteredExpenses.reduce((total, expense) => total + parseFloat(expense.total), 0);
   const hosalarygraph=hoTotalSalary;
   setothExpenses(othexpense);
   sethosalaryExpenses(hosalarygraph);
 
    setTotalSale(totalSale);
    setTotalExpense(totalExpense);
  };

  filterAndCalculateTotals();
}, [saleData, expenseData, month, year, hoData]);


useEffect(() => {
  const mapDataToStats = () => {
    const companyBusiness = {
      paymentPaid: CompanyDataTotals.paymentPaid,
    };

    const franchiseSales = {
      totalPaymentPaid: totalPaymentPaid, // Already calculated in `calculateTotals`
    };

    const vipBusiness = {
      paymentPaid: totals.paymentPaid,
    };

    const vipFranchiseBusiness = {
      paymentPaid: vipFranchiseTotals.paymentPaid,
    };

    const otherStats = {
      totalSales: totalSale, // Already calculated
      totalExpense: totalExpense, // Already calculated
    };

    return {
      companyBusiness,
      franchiseSales,
      vipBusiness,
      vipFranchiseBusiness,
      otherStats,
    };
  };

  const stats = mapDataToStats();

  // Calculate Total Income and Expenses
  const income =
    (stats.companyBusiness.paymentPaid || 0) +
    (stats.franchiseSales.totalPaymentPaid || 0) +
    (stats.otherStats.totalSales || 0);

  const expenses =
    (stats.vipBusiness.paymentPaid || 0) +
    (stats.vipFranchiseBusiness.paymentPaid || 0) +
    (stats.otherStats.totalExpense || 0);

  setTotalIncome(income);
  setTotalExpenses(expenses);
}, [
  CompanyDataTotals,
  vipFranchiseTotals,
  totalSale,
  totalExpense,
  totalPaymentPaid,
]);


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
        <DashboardHeading1>Dashboard</DashboardHeading1>

       {/* Filters */}
       {/* Year and Month Filter */}
       <FilterContainer>
          <FilterSelect value={month} onChange={handleMonthChange}>
            <option value="All">All</option>
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
            <option value="All">All</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </FilterSelect>
        </FilterContainer>
      </DashboardHeadingContainer>

      <DashboardHeading>VIP Business Stats</DashboardHeading>
<StatsSection>
  {Object.entries(totals).map(([key, value]) => (
    <StatCard key={key}>
      <StatLabel>{key.replace(/([A-Z])/g, " $1")}</StatLabel>
      <StatValue>₹{value}</StatValue>
    </StatCard>
  ))}
</StatsSection>

<DashboardHeading>VIP Franchise Business Stats</DashboardHeading>
<StatsSection>
  {Object.entries(vipFranchiseTotals).map(([key, value]) => (
    <StatCard key={key}>
      <StatLabel>{key.replace(/([A-Z])/g, " $1")}</StatLabel>
      <StatValue>₹{value}</StatValue>
    </StatCard>
  ))}
</StatsSection>

<DashboardHeading>Company Business Stats</DashboardHeading>
<StatsSection>
  {Object.entries(CompanyDataTotals).map(([key, value]) => (
    <StatCard key={key}>
      <StatLabel>{key.replace(/([A-Z])/g, " $1")}</StatLabel>
      <StatValue>₹{value.toLocaleString()}</StatValue> {/* Format numbers */}
    </StatCard>
  ))}
</StatsSection>



<DashboardHeading>Franchise Sales Stats</DashboardHeading>
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

  <DashboardHeading>Other  Stats</DashboardHeading>
      <StatsSection>  
  <StatCard>
    <StatLabel>Other Sales</StatLabel>
    <StatValue> ₹{totalSale}</StatValue>
  </StatCard>
  <StatCard>
    <StatLabel> Other Expense</StatLabel>
    <StatValue> ₹{totalExpense}</StatValue>
  </StatCard>
  <StatCard>
    <StatLabel> Ho Salary</StatLabel>
    <StatValue> ₹{hosalaryExpenses}</StatValue>
  </StatCard>
</StatsSection>

<DashboardHeading>P & L Stats</DashboardHeading>
  <StatsSection>  
  <StatCard>
    <StatLabel>Total  Income</StatLabel>
    <StatValue>₹{totalIncome}</StatValue>
  </StatCard>
  <StatCard>
    <StatLabel>Total  Expense</StatLabel>
    <StatValue>₹{totalExpenses}</StatValue>
  </StatCard>
</StatsSection>

      <GraphSection>
        <GraphItem>
          <GraphTitle>P & L </GraphTitle>
          <ChartContainer>
  <Doughnut
    data={{
      labels: ["Total Income", "Total Expenses"],
      datasets: [
        {
          data: [totalIncome, totalExpenses], // Use dynamic data
          backgroundColor: ["#4CAF50", "#F44336"], // Colors for each segment
          hoverBackgroundColor: [ "#81C784","#E57373"], // Colors on hover
        },
      ],
    }}
    options={{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top", // Adjust the legend position
        },
      },
    }}
  />
</ChartContainer>
        </GraphItem>

    

<GraphItem>
  <GraphTitle>Profit</GraphTitle>
  <ChartContainer>
    <Bar
      data={{
        labels: ["Company Buisness", "Franchise Sales", "Other Sales"], // Labels for each bar
        datasets: [
          {
            label: "Profit Data", // Dataset label
            data: [CompanyDataTotals.paymentPaid, totalPaymentPaid, totalSale], // Dynamic data values
            backgroundColor: ["#4CAF50", "#4CAF50", "#4CAF50"], // Colors for bars
            hoverBackgroundColor: ["#81C784", "#81C784", "#81C784"], // Hover colors
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Legend is hidden since there's one dataset
          },
          tooltip: {
            enabled: true, // Tooltips enabled for better interaction
          },
        },
        scales: {
          x: {
            grid: {
              display: false, // Remove gridlines for a cleaner x-axis
            },
          },
          y: {
            beginAtZero: true, // Ensure y-axis starts from 0
            ticks: {
              precision: 0, // Avoid decimals if the values are integers
            },
          },
        },
      }}
    />
  </ChartContainer>
</GraphItem>


<GraphItem>
  <GraphTitle>Loss</GraphTitle>
  <ChartContainer>
    <Bar
      data={{
        labels: ["Vip Buisness", "Vip Franchise Buisness", "Other Expense","Ho Salary"], // Labels for each bar
        datasets: [
          {
            label: "Profit Data", // Dataset label
            data: [totals.paymentPaid,vipFranchiseTotals.paymentPaid,othExpenses,hosalaryExpenses], // Dynamic data values
            backgroundColor: ["#F44336", "#F44336", "#F44336"], // Colors for bars
            hoverBackgroundColor: ["#E57373", "#E57373", "#E57373"], // Hover colors
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Legend is hidden since there's one dataset
          },
          tooltip: {
            enabled: true, // Tooltips enabled for better interaction
          },
        },
        scales: {
          x: {
            grid: {
              display: false, // Remove gridlines for a cleaner x-axis
            },
          },
          y: {
            beginAtZero: true, // Ensure y-axis starts from 0
            ticks: {
              precision: 0, // Avoid decimals if the values are integers
            },
          },
        },
      }}
    />
  </ChartContainer>
</GraphItem>;

        
      </GraphSection>

      <BackButton onClick={handleBackClick}>Back</BackButton>
    </DashboardContainer>
  );
};

export default Dashboard;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color:#2b2a2f;
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
const DashboardHeading1 = styled.h1`
  font-size: 2.5rem;
  color: #fff;
  margin: 0;
`;
const DashboardHeading = styled.h1`
  font-size: 1.5rem;
  color: #fff;
  margin: 0;
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
    color: rgba(255, 255, 255, 0.5); /* Lightly transparent */
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


const GraphSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3.5rem;
  margin-bottom: 0.5rem;
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
  width: 98%;
  height: 300px; /* Set a fixed height for a consistent look */
  position: relative;
`;
// Set responsive options for Chart.js

const BackButton = styled.button`
  background-color: #f00d88;
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
    background-color: #444;
  }

  &:focus {
    outline: none;
  }
`;
