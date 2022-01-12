import React, { useState } from "react";
import styled from 'styled-components';
import Collapse from '../Collapse/Collapse';
import Ticket from '../Ticket/Ticket';

const InnerAssignList = styled.div`
`;

const AssignList = ({ list, onClick }) => {
  const ref = React.createRef();
  const [assignsOpened, setAssignsOpened] = useState({});

  const clicked = (assignName) => {
    const newAssignsOpened = {
      ...assignsOpened,
      [assignName]: !assignsOpened[assignName]
    };
    console.log(newAssignsOpened)
    setAssignsOpened(newAssignsOpened);
    onClick(newAssignsOpened);
  };

  const components = list.map((assign) => {
    const contentComponents = assign.tickets.map(ticket => {
      return <Ticket key={ticket.id} ticket={ticket}></Ticket>
    });
    return <Collapse isAssignList={true} open={assignsOpened[assign.name]} key={assign.name} data={assign} contentComponents={contentComponents} onClick={clicked.bind(this, assign.name)}></Collapse>
  });

  return (
    <InnerAssignList ref={ref}>
      {components}
    </InnerAssignList>
  );

};

export default AssignList;
