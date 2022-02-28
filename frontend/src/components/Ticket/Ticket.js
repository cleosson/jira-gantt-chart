import React from "react";
import styled from 'styled-components';
import moment from 'moment';

window.moment = moment;

const InnerTicket = styled.div`
  position: absolute;
  display: ${props => (props.open ? "none" : "block")};
  z-index: 10;
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
  const startDay = +ticket.startDate.format("D");
  const marginLeft = (startDay * 32);

  const endMonth = +ticket.endDate.format("M");
  const endDay = +ticket.endDate.format("D");
  let widthValue = ((endDay - startDay) * 32) + 32;
  if (endMonth > 1) {
    const days = ticket.endDate.diff(ticket.startDate, 'days');
    widthValue = (days * 32) + 32;
  }
  return (
    <InnerTicket open={ticket.opened} marginLeft={marginLeft} widthValue={widthValue} color={stringToColour(ticket.startDate.format("dddd, MMMM Do YYYY"))}>
      <a href={ticket.href} target="_blank">{ticket.key} {ticket.name}</a>
    </InnerTicket>
  );
};

export default Ticket;
