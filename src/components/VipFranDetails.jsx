import React from "react";
import NavBar from "./Navbar";
import { styled } from "styled-components";
import VipFranListTable from "./VipFranListTable"

function VipDetailContainer() {
  return (
    <VipDetailsContainer>
      <NavBar selected={"vipfrfanchise"} />
      <VipFranListTable/>
    </VipDetailsContainer>
  );
}

const VipDetailsContainer = styled.div`
  display: flex;
  background-color:#2b2a2f;
  overflow: hidden;
`;
export default VipDetailContainer;
