import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import EpicList from '../EpicList/EpicList';
import InnerCalendar from './InnerCalendar';

const Inner = styled.div`
  display: flex;
  position: absolute;
`;

const InnerComponents = styled.div`
  display: flex;
  position: absolute;
  margin-left: 300px;
`;

const Calendar = () => {
  const ref = React.createRef();
  const [epicsOpened, setEpicsOpened] = useState([]);
  const [assignsOpened, setAssignsOpened] = useState([]);

  const [openedRows, setOpenedRows] = useState(0);

  useEffect(() => {
    const _openedRows = Math.round(ref.current.offsetHeight / 23);
    setOpenedRows(_openedRows);
  });

  const onChange = (_epicsOpened) => {
    setEpicsOpened(_epicsOpened)
  }

  const assignOnChange = (_assignsOpened) => {
    setAssignsOpened(_assignsOpened)
  }
  
  return (
    <Inner>
      <EpicList ref={ref} onChange={onChange} assignOnChange={assignOnChange}></EpicList>
      <InnerComponents>
        <InnerCalendar openedRows={openedRows}></InnerCalendar>
      </InnerComponents>
    </Inner>
  );
};

export default Calendar;
