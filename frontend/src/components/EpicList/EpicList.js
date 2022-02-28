import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import Collapse from '../Collapse/Collapse';
import AssignList from '../AssignList/AssignList';
import Ticket from '../Ticket/Ticket';

const InnerEpicList = styled.div`
  position: relative;
  width: 100%;
  min-width: 300px;
  margin-top: 73px;
`;

const InnerComponent = styled.div`
  display: flex;
`;

const EpicList = React.forwardRef((props, ref) => {

  const epicIdList = props.epics.map(epic => {
    return epic.id;
  })
  const defaultEpicsOpened = epicIdList.reduce((prevValue, currentValue) => ({ ...prevValue, [currentValue]: false}), {});
  const [epicsOpened, setEpicsOpened] = useState(defaultEpicsOpened);

  const clicked = (epic) => {
    epic.opened = !epic.opened; 
    const newEpicsOpened = {
      ...epicsOpened,
      [epic.id]: !epicsOpened[epic.id]
    };
    setEpicsOpened(newEpicsOpened);
    props.onChange([...props.epics]);
  };

  const assignClick = (assignees) => {
    props.onChange([...props.epics]);
  };

  let components = props.epics.map((epic) => {
    const contentComponents = <AssignList assignees={epic.assignees} onClick={assignClick.bind(this)}></AssignList>
    return (
      <InnerComponent key={epic.id}>
        <Collapse isEpicList={true} open={epicsOpened[epic.id]} data={epic} contentComponents={contentComponents} onClick={clicked.bind(this, epic)}></Collapse>
      </InnerComponent>
    )
  });

  return (
    <InnerEpicList ref={ref}>
      {components}
    </InnerEpicList>
  );
});

export default EpicList;
