import React from "react";
import styled from 'styled-components';
import moment from 'moment';

const InnerTicket = styled.div`
  width: ${props => (props.widthValue ? `${props.widthValue}px` : "0")};
  margin-left: ${props => (props.marginLeft ? `${props.marginLeft}px` : "0")};
  border: 1px solid;
  background-color: ${props => (props.color ? `${props.color}` : "#fefefe")};

  a {
    color: white;
    padding-left: 4px;
  }
`;

const stringToColour = (str) => {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

const Ticket = ({ ticket }) => {
  const startYear = ticket.startDate.format("Y");
  const startMonth = ticket.startDate.format("M");
  const startDay = ticket.startDate.format("D");
  let marginLeft = (startDay * 32) - 32;

  if (startMonth > 1) {
    marginLeft = (moment(`${startYear}-${startMonth}`).daysInMonth() + startDay) * 32;
  }

  const endYear = ticket.endDate.format("Y");
  const endMonth = ticket.endDate.format("M");
  const endDay = ticket.endDate.format("D");
  let widthValue = ((endDay - startDay) * 32) + 32;



  if (endMonth > 1) {
    console.log(endMonth);
    const days = Array.from(Array(Math.round(endMonth)).keys()).map((value) => {
      const currentMonth = value + 1;
      if (currentMonth != endMonth)  {
        return moment(`${endYear}-${currentMonth}`).daysInMonth()
      } else {
        return 0;
      }
    }).reduce((prevValue, nextValue) => prevValue + nextValue, 0);
    widthValue = ((days + (endDay - startDay)) * 32) + 32;
  }

  return (
    <InnerTicket marginLeft={marginLeft} widthValue={widthValue} color={stringToColour(ticket.startDate.format("dddd, MMMM Do YYYY"))}>
      <a href={ticket.href} target="_blank">{ticket.id}</a>
    </InnerTicket>
  );
};

export default Ticket;
