import React from "react";
import NavBar from "./Navbar";
import { styled } from "styled-components";
import ExpenseListTable from "./ExpenseListTable";

function ExpenseDetailContainer() {
  return (
    <ExpenseDetailsContainer>
      <NavBar selected={"expense"} />
     <ExpenseListTable/>
     </ExpenseDetailsContainer>
  );
}

const ExpenseDetailsContainer = styled.div`
  display: flex;
  background-color:#2b2a2f;
  overflow: hidden;
`;
export default ExpenseDetailContainer;
