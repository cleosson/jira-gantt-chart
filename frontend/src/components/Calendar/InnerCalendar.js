import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

const Inner = styled.div`
  display: flex;
`;


const Month = styled.div`
  p {
    margin: 0;
    font-size: 20px;
  }
`;

const Days = styled.div`
  display: flex;
`;

const Day = styled.div`
  border: 1px solid #ddd;
  width: 30px;
  height: 21px;
  text-align: center;

  p {
    margin: 0;
    font-size: 14px;
  }
`;

const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]

const InnerCalendar = (props) => {
  const currentMonthDates = months.map(value => {
    const month = `${moment().format("Y")}-${months[value - 1]}-01`;
    return Array.from({
      length: moment(month).daysInMonth()
    }, (x, i) => moment(month).startOf('month').add(i, 'days'));
  });

  const components = currentMonthDates.map((month, i) => {
    const innerDates =  month.map((date, index)  => {
      return <Day key={`${index.toString()}`}>
        { date.format("DD") }
      </Day>
    });
    const cell =  month.map((date, index)  => {
      return <Day key={`${index.toString()}`}>
      </Day>
    });
    const cells = Array.from(Array(props.openedRows).keys()).map((value) => {
      return <Days key={`Cell-${value.toString()}`}>
        { cell }
      </Days>
    });

    return <Month key={`Month-${i.toString()}`}>
      <p key={`MonthTitle${i.toString()}`}>{ month[i].format("MMMM") }</p>
      <Days key={`Days-${i.toString()}`}>
        { innerDates }
      </Days>
      { cells }
    </Month>;
  });
  
  return (
    <Inner>
      {components}
    </Inner>
  );
};

export default InnerCalendar;
