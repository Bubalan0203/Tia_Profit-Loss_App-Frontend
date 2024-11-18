import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import axios from "axios";
import { Box, Tabs, Tab,CircularProgress } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import AddSales from "./AddForms/AddSales";
import ViewSales from "./Tables/ViewSales";



function SalesListTable({ user, courseListTitles }) {
  const [filter, setFilter] = useState(false);
  const [filterData, setFilterData] = useState("");
  const [selectedView, setSelectedView] = useState("AddSalesList");
  const [loading, setLoading] = useState(false);

  const FilterOpen = () => {
    setFilter(!filter);
  };

  const handleChange = (event, newValue) => {
   
    setSelectedView(newValue);// 2 seconds
  };

  return (
    <SalesTableContainer>
      <div
        id="course-list"
        style={{
        
        }}
      >
         {loading && (
          <LoadingOverlay>
            <CircularProgress sx={{ color: "#f00d88" }} />
          </LoadingOverlay>
        )}
        
        <Box
          sx={{
            marginTop: "1rem",
            width: "100%",
            backgroundColor: "var(--navbar-dark-primary)",
            borderRadius: "8px",
            boxShadow: 3,
            padding: "1rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Tabs
            value={selectedView}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Course Navigation Tabs"
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              "& .MuiTab-root": {
                minWidth: "150px",
                fontWeight: "bold",
                fontSize: "0.875rem",
                color: "white",
                "&.Mui-selected": {
                  color: "white",
                },
                margin: "0 0.5rem",
              },
              "& .MuiTabs-indicator": {
                height: "4px",
                backgroundColor: "#f00d88",
              },
            }}
          >
            <Tab label="View Sales" value="ViewSalesList" />
            <Tab label="Add Sales" value="AddSalesList" />
          </Tabs>
        </Box>

        <div>
          {selectedView === "ViewSalesList" && (
            <ViewSales filterData={filterData} />
          )}
          {selectedView === "AddSalesList" && <AddSales />}
        </div>
      </div>
    </SalesTableContainer>
  );
}
const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;
const SalesTableContainer = styled.div`
  width: 100%;

  #course-list {
    padding: 2rem;
     position: relative;
  }

  ::placeholder {
    color: gray;
    opacity: 1; /* Firefox */
  }
  ::-ms-input-placeholder {
    /* Edge 12-18 */
    color: gray;
  }
  .btn {
    background-color: var(--navbar-dark-primary);
    padding: 1rem;
    color: white;
    font-weight: 600;
    display: flex;
    flex-direction: column;
  }
  #line {
    background-color: var(--icon-color);
    height: 3px;
    width: 100%;
  }
  h2 {
    color: white;
  }
  @media only screen and (max-width: 800px) {
    #miniNav {
      display: block !important;
    }
    h2 {
      margin-left: 3rem;
    }
  }
  #miniNav {
    display: none;
  }
  #searchfield {
    height: 3.5rem;
    padding-right: 25px;
    background-color: #36283a;
    padding: 1rem;
    background-size: 20px;
    border-radius: 5px;
    margin-right: 1rem;
  }

  #searchfield > input {
    border: 0px solid;
    background-color: #36283a;
    height: 20px;
    width: 10rem;
  }

  textarea:focus,
  input:focus {
    outline: none;
  }
  ::placeholder {
    color: #bf2f82c4;
    opacity: 1; /* Firefox */
  }

  ::-ms-input-placeholder {
    /* Edge 12 -18 */
    color: #bf2f82c4;
  }

  .font {
    border: 0px solid;
    color: #bf2f82c4;
  }

  .icon-button {
    font-size: 2rem;
    padding: 0.2rem;
    background-color: #36283a;
    border-radius: 5rem;
    width: 3.5rem;
  }

  .icon {
    color: #bf2f82c4;
    border-radius: 5rem;
  }

  #table-container {
    background-color: #25272d;
    margin-top: 3rem;
    padding: 2rem;
    border-radius: 10px;
    height: 83vh;
  }

  #table-container thead th {
    position: sticky;
    top: 0;
  }

  .t-head {
    background-color: #18171b !important;
    color: white !important;
    padding: 1rem !important;
    text-align: center;
  }
  h4 {
    text-align: center;
  }

  table.rounded-corners {
    border-spacing: 0;
    border-collapse: separate;
    border-radius: 10px;
  }

  table.rounded-corners th,
  table.rounded-corners td {
    border: 1px solid black;
  }

  thead tr {
    border-bottom: 1rem solid #25272d;
  }
  tr {
    border-color: #25272d;
  }

  .table > :not(caption) > * > * {
    background-color: #25272d;
  }
`;

export default SalesListTable;