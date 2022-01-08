import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import AssignList from '../AssignList/AssignList';

const InnerCalendar = styled.div`
  display: flex;
`;

const InnerComponents = styled.div`
  display: flex;
  height: 50px;
  margin-left: 200px;
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
  border: 1px solid gray;
  width: 30px;
  text-align: center;

  p {
    margin: 0;
    font-size: 14px;
  }
`;

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

class Calendar extends React.Component {

  constructor() {
    super();
    this.state = {};
    this.currentMonthDates = months.map(value => {
      const month = `${moment().format("Y")}-${months[value - 1]}`;
      return Array.from({
        length: moment(month).daysInMonth()
      }, (x, i) => moment(month).startOf('month').add(i, 'days'));
    });
  }

  render() {
    const components = this.currentMonthDates.map((month, i) => {
      const innerDates =  month.map((date, index)  => {
        return <Day key={`${index.toString()}`}>
          { date.format("DD") }
        </Day>
      });
      return <Month key={`Month-${i.toString()}`}>
        <p key={`MonthTitle${i.toString()}`}>{ month[i].format("MMMM") }</p>
        <Days key={`Days-${i.toString()}`}>
          { innerDates }
        </Days>
      </Month>;
    });

    return (
      <InnerCalendar>
        <AssignList></AssignList>
        <InnerComponents>
          {components}
        </InnerComponents>
      </InnerCalendar>
    );
  }
}

export default Calendar;
