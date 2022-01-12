import React, { useState } from "react";
import styled from 'styled-components';
import Collapse from '../Collapse/Collapse';
import AssignList from '../AssignList/AssignList';
import Ticket from '../Ticket/Ticket';
import moment from 'moment';

const InnerEpicList = styled.div`
  position: relative;
  width: 100%;
  min-width: 300px;
  margin-top: 50px;
`;

const InnerComponent = styled.div`
  display: flex;
`;

const EpicList = React.forwardRef((props, ref) => {
  const [epics, setEpics] = useState([
    {
      id: "EPIC-0001",
      href: "https://test.com/EPIC-0001",
      name: "Epic test",
      list: [
        {
          name: "Renato Trevisan",
          tickets: [
            {
              id: "TEST-0001",
              href: "https://test.com/TEST-0001",
              startDate: moment("2021-01-01"),
              endDate: moment("2021-01-07")
            },
            {
              id: "TEST-0002",
              href: "https://test.com/TEST-0002",
              startDate: moment("2021-01-07"),
              endDate: moment("2021-01-14")
            }
          ]
        },
        {
          name: "Cleosson Souza",
          tickets: [
            {
              id: "TEST-0003",
              href: "https://test.com/TEST-0004",
              startDate: moment("2021-01-01"),
              endDate: moment("2021-01-14")
            },
            {
              id: "TEST-0004",
              href: "https://test.com/TEST-0004",
              startDate: moment("2021-01-14"),
              endDate: moment("2021-01-31")
            }
          ]
        },
        {
          name: "John Tester",
          tickets: [
            {
              id: "TEST-0003",
              href: "https://test.com/TEST-0004",
              startDate: moment("2021-01-08"),
              endDate: moment("2021-03-20")
            },
            {
              id: "TEST-0004",
              href: "https://test.com/TEST-0004",
              startDate: moment("2021-01-16"),
              endDate: moment("2021-02-10")
            }
          ]
        }
      ]
    },
    {
      id: "EPIC-0002",
      href: "https://test.com/EPIC-0002",
      name: "Epic test 2 browser",
      list: [
        {
          name: "Renato Trevisan",
          tickets: [
            {
              id: "TEST-0001",
              href: "https://test.com/TEST-0001",
              startDate: moment("2021-01-03"),
              endDate: moment("2021-01-07")
            },
            {
              id: "TEST-0002",
              href: "https://test.com/TEST-0002",
              startDate: moment("2021-01-07"),
              endDate: moment("2021-01-14")
            }
          ]
        },
        {
          name: "Cleosson Souza",
          tickets: [
            {
              id: "TEST-0003",
              href: "https://test.com/TEST-0004",
              startDate: moment("2021-01-03"),
              endDate: moment("2021-01-14")
            },
            {
              id: "TEST-0004",
              href: "https://test.com/TEST-0004",
              startDate: moment("2021-01-14"),
              endDate: moment("2021-01-25")
            }
          ]
        }
      ]
    },
  ]);
  const epicIdList = epics.map(epic => {
    return epic.id;
  })
  const defaultEpicsOpened = epicIdList.reduce((prevValue, currentValue) => ({ ...prevValue, [currentValue]: false}), {});
  const [epicsOpened, setEpicsOpened] = useState(defaultEpicsOpened);

  const clicked = (id) => {
    const newEpicsOpened = {
      ...epicsOpened,
      [id]: !epicsOpened[id]
    };

    setEpicsOpened(newEpicsOpened);
    props.onChange(newEpicsOpened);
  };

  const assignClick = (_assignsOpened) => {
    props.assignOnChange(_assignsOpened);
  };

  const components = epics.map((epic) => {
    epic.startDate = epic.list.reduce((prevValue, currentValue) => {
      const _startDate = currentValue.tickets.reduce((prevTicket, currentTicket) => {
        return moment(prevTicket.startDate).isBefore(currentTicket.startDate) ? prevTicket.startDate : currentTicket.startDate;
      });
      if (moment.isMoment(prevValue)) {
        return moment(_startDate).isBefore(prevValue) ? _startDate: prevValue;
      } else {
        return _startDate;
      }
    });
    epic.endDate = epic.list.reduce((prevValue, currentValue) => {
      const _endDate =  currentValue.tickets.reduce((prevTicket, currentTicket) => {
        return moment(prevTicket.endDate).isAfter(currentTicket.endDate) ? prevTicket.endDate : currentTicket.endDate;
      });
      if (moment.isMoment(prevValue)) {
        return moment(_endDate).isAfter(prevValue) ? _endDate: prevValue;
      } else {
        return _endDate;
      }
    });

    const contentComponents = <AssignList list={epic.list} onClick={assignClick}></AssignList>
    return (
      <InnerComponent key={epic.id}>
        <Collapse isEpicList={true} open={epicsOpened[epic.id]} data={epic} contentComponents={contentComponents} onClick={clicked.bind(this, epic.id)}></Collapse>
        <Ticket ticket={epic} open={epicsOpened[epic.id]}></Ticket>
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
