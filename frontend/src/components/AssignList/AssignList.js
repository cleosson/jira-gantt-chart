import React, { useState } from "react";
import styled from 'styled-components';
import Collapse from '../Collapse/Collapse';
import Ticket from '../Ticket/Ticket';

const InnerAssignList = styled.div`
`;

const InnerComponent = styled.div`
  display: flex;
`;

const AssignList = ({ assignees, onClick }) => {
  const ref = React.createRef();
  const [assignsOpened, setAssignsOpened] = useState({});

  const clicked = (assignee) => {
    assignee.opened = !assignee.opened; 
    const newAssignsOpened = {
      ...assignsOpened,
      [assignee.name]: !assignsOpened[assignee.name]
    };
    setAssignsOpened(newAssignsOpened);
    onClick();
  };

  let components = assignees.map((assignee) => {
    return (
      <InnerComponent key={assignee.name}>
        <Collapse isAssignList={true} open={assignsOpened[assignee.name]} data={assignee} onClick={clicked.bind(this, assignee)}></Collapse>
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
