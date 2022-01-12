import React, { useState } from "react";
import styled from 'styled-components';
import moment from 'moment';
import Collapse from '../Collapse/Collapse';
import Ticket from '../Ticket/Ticket';

const InnerAssignList = styled.div`
`;

const InnerComponent = styled.div`
  display: flex;
`;

const AssignList = ({ list, onClick }) => {
  const ref = React.createRef();
  const [assignsOpened, setAssignsOpened] = useState({});

  const clicked = (assignName) => {
    const newAssignsOpened = {
      ...assignsOpened,
      [assignName]: !assignsOpened[assignName]
    };
    setAssignsOpened(newAssignsOpened);
    onClick(newAssignsOpened);
  };

  const components = list.map((assign) => {
    assign.startDate = assign.tickets.reduce((prevValue, currentValue) => {
      return moment(prevValue.startDate).isBefore(currentValue.startDate) ? prevValue.startDate : currentValue.startDate;
    });
    assign.endDate = assign.tickets.reduce((prevValue, currentValue) => {
      return moment(prevValue.endDate).isAfter(currentValue.endDate) ? prevValue.endDate : currentValue.endDate;
    });
    assign.id = assign.tickets.reduce((prevValue, currentValue) => {
      return `${prevValue.id}, ${currentValue.id}`;
    });
    const contentComponents = assign.tickets.map(ticket => {
      return <Ticket key={ticket.id} ticket={ticket}></Ticket>
    });
    return (
      <InnerComponent key={assign.name}>
        <Collapse isAssignList={true} open={assignsOpened[assign.name]} data={assign} contentComponents={contentComponents} onClick={clicked.bind(this, assign.name)}></Collapse>
        <Ticket ticket={assign} open={assignsOpened[assign.name]}></Ticket>
      </InnerComponent>
    )
  });

  return (
    <InnerAssignList ref={ref}>
      {components}
    </InnerAssignList>
  );

};

export default AssignList;
