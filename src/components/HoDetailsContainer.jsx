import React from "react";
import NavBar from "./Navbar";
import { styled } from "styled-components";
import HosListTable from "./HoListTable";

function HosDetailContainer() {
  return (
    <HosDetailsContainer>
      <NavBar selected={"hosstaff"} />
      <HosListTable />
    </HosDetailsContainer>
  );
}

const HosDetailsContainer = styled.div`
  display: flex;
  background-color:#2b2a2f;
  overflow: hidden;
`;
export default HosDetailContainer;
