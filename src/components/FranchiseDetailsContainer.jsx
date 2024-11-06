import React from "react";
import NavBar from "./Navbar";
import { styled } from "styled-components";
import FranchiseListTable from "./FranchiseListTable";

function FranchiseDetailContainer() {
  return (
    <FranchiseDetailsContainer>
      <NavBar selected={"franchise"} />
      <FranchiseListTable />
    </FranchiseDetailsContainer>
  );
}

const FranchiseDetailsContainer = styled.div`
  display: flex;
  background-color:#2b2a2f;
  overflow: hidden;
`;
export default FranchiseDetailContainer;
