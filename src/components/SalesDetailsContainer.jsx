import React from "react";
import NavBar from "./Navbar";
import { styled } from "styled-components";
import SalesListTable from "./SalesListTable";

function SalesDetailContainer() {
  return (
    <SalesDetailsContainer>
      <NavBar selected={"sales"} />
      <SalesListTable />
    </SalesDetailsContainer>
  );
}

const SalesDetailsContainer = styled.div`
  display: flex;
  background-color:#2b2a2f;
  overflow: hidden;
`;
export default SalesDetailContainer;
