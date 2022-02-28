import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import EpicList from '../EpicList/EpicList';
import InnerCalendar from './InnerCalendar';
import moment from 'moment';


const Inner = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
`;

const InnerComponents = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  margin-left: 300px;
  width: calc(100% - 300px);
  margin-left: 300px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
`;

const STATUS = {
  DONE: "Done",
  IN_PROGRESS: "In Progress",
  BACKLOG: "Backlog"
}


const Calendar = () => {
  const ref = React.createRef();
  const [epicsOpened, setEpicsOpened] = useState([]);
  const [assignsOpened, setAssignsOpened] = useState([]);
  const [openedRows, setOpenedRows] = useState(0);

  useEffect(() => {
    const query = `query GetBoard {
      Board(boardId: 3) {
        sprints{
          id,
          name,
          startDate,
          endDate,
          completeDate,
          state
        },
        epics {
          id,
          key,
          name,
          assignees {
            name,
            issues {
              id,
              key,
              name,
              status,
              reporter,
              resolution
              resolutionDate,
              sprintId,
              closedSprints
            }
          }
        }
      }
    }`;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          query,
          variables: null
      })
    };
    fetch('http://localhost:8888/graphql', requestOptions)
      .then(response => response.json())
      .then(response => {
        setSprints(response.data.Board.sprints);
        setEpics(modifyData(response.data.Board.epics, response.data.Board.sprints));
      });
  }, []);

  useEffect(() => { 
    const _openedRows = Math.round(ref.current.offsetHeight / 23);
    setOpenedRows(_openedRows);
  });


  const [sprints, setSprints] = useState([]);
  const [epics, setEpics] = useState([]);

  const onChange = (_epics) => {
    setEpics(modifyData(_epics, sprints));
  }


  const assignOnChange = (_assignsOpened) => {
    setAssignsOpened(_assignsOpened)
  }

  const modifyData = (epics, sprints) => {
    epics = epics.map(epic => {
      // epic.opened = false;
      epic.assignees = epic.assignees.map(assignee => {
        // assignee.opened = false;
        assignee.issues = assignee.issues.map(issue => {
          if (issue.status === STATUS.DONE) {
            let sprintId = Math.min(...issue.closedSprints);
            issue.startDate = moment(sprints.find((sprint) => sprint.id === sprintId).startDate);
          } else {
            issue.startDate = moment(sprints.find((sprint) => sprint.id === issue.sprintId).startDate)
          }
          if (issue.status === STATUS.DONE) {
            issue.endDate = moment(issue.resolutionDate);
          } else {
            issue.endDate = moment(sprints.find((sprint) => sprint.id === issue.sprintId).endDate)
          }
          issue.href = `https://loganchart.atlassian.net/browse/${issue.key}}`;

          return issue;
        });
  
        assignee.startDate = assignee.issues.reduce((prevValue, currentValue) => {
          return moment(prevValue).isBefore(currentValue.startDate) ? prevValue : currentValue.startDate;
        }, assignee.issues[0].startDate);
        assignee.endDate = assignee.issues.reduce((prevValue, currentValue) => {
          return moment(prevValue).isAfter(currentValue.endDate) ? prevValue : currentValue.endDate;
        }, assignee.issues[0].endDate);
  
        return assignee;
      });

      epic.startDate = epic.assignees.reduce((prevValue, currentValue) => {
        return moment(prevValue).isBefore(currentValue.startDate) ? prevValue : currentValue.startDate;
      }, epic.assignees[0].startDate);
      epic.endDate = epic.assignees.reduce((prevValue, currentValue) => {
        return moment(prevValue).isAfter(currentValue.endDate) ? prevValue : currentValue.endDate;
      }, epic.assignees[0].endDate);
  
      return epic;

    });
    return epics;
  }

  return (
    <Inner>
      <EpicList ref={ref} onChange={onChange} assignOnChange={assignOnChange} epics={epics}></EpicList>
      <InnerComponents>
        <InnerCalendar openedRows={openedRows} epicsOpened={epicsOpened} assignsOpened={assignsOpened} epics={epics}></InnerCalendar>
      </InnerComponents>
    </Inner>
  );
};

export default Calendar;
