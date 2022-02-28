import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import Ticket from '../Ticket/Ticket';

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
    const innerDatesExtension =  month.map((date, index)  => {
      return <Day key={`${index.toString()}`}>
        { date.format("dd")  }
      </Day>
    });
    const innerDates =  month.map((date, index)  => {
      return <Day key={`${index.toString()}`}>
        { date.format("D")  }
      </Day>
    });
    const cell =  month.map((date, index)  => {
      return <Day key={`${index.toString()}`}>
      </Day>
    });
    const cells = props.epics.map((epic) => {
      let epicTicket;
      if (epic.startDate.format("M") - 1 === i) {
        epicTicket = <Ticket ticket={epic}></Ticket>;
      }
      let cellsDay = [(
        <Days key={`Cell-epic-${epic.id}`}>
        { epicTicket }
      </Days>
      )];
      if (epic.opened) {
        let assigneeCells = epic.assignees.map(assignee => {
          let assigneeTicket;
          if (assignee.startDate.format("M") - 1 === i) {
            assigneeTicket = <Ticket ticket={assignee}></Ticket>;
          }
          if (assignee.opened) {
            let issueCells = assignee.issues.map(issue => {
              let issueTicket;
              if (issue.startDate.format("M") - 1 === i) {
                issueTicket = <Ticket ticket={issue}></Ticket>;
              }
              return <Days key={`Cell-${issue.key}-opened`}>
                { cell }
                { issueTicket }
              </Days>
            })
            cellsDay.push(issueCells);
          } else {
          return <Days key={`Cell-${assignee.name}-opened`}>
            { cell }
            { assigneeTicket }
          </Days>
          }
        })
        cellsDay.push(assigneeCells);
      } else {
        cellsDay.push(
          <Days key={`Cell-${epic.id}`}>
            {cell}
          </Days>
        );
      }
      return cellsDay
    });

    return <Month key={`Month-${i.toString()}`}>
      <p key={`MonthTitle${i.toString()}`}>{ month[i].format("MMMM") }</p>
      <Days key={`Days-extension-${i.toString()}`}>
        { innerDatesExtension }
      </Days>
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
