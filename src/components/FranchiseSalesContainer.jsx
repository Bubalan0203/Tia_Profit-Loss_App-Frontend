import React from "react";
import NavBar from "./Navbar";
import { styled } from "styled-components";
import FranchiseSalesTable from "./FranchiseSalesTable";

function FranchiseSalesContainer() {
  return (
    <FsalesContainer>
      <NavBar selected={"vip"} />
      <FranchiseSalesTable />
    </FsalesContainer>
  );
}

const FsalesContainer = styled.div`
  display: flex;
  background-color:#2b2a2f;
  overflow: hidden;
`;
export default FranchiseSalesContainer;
