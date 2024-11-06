import React from "react";
import NavBar from "./Navbar";
import { styled } from "styled-components";
import VipListTable from "./VipListTable";

function VipDetailContainer() {
  return (
    <VipDetailsContainer>
      <NavBar selected={"vip"} />
      <VipListTable />
    </VipDetailsContainer>
  );
}

const VipDetailsContainer = styled.div`
  display: flex;
  background-color:#2b2a2f;
  overflow: hidden;
`;
export default VipDetailContainer;
