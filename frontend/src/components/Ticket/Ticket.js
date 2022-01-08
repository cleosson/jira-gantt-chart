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

class Ticket extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: props.ticket.id,
      href: props.ticket.href,
      startDate: props.ticket.startDate,
      endDate: props.ticket.endDate
    };
  }

  stringToColour(str) {
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

  render() {
    const startYear = this.state.startDate.format("Y");
    const startMonth = this.state.startDate.format("MM");
    const startDay = this.state.startDate.format("DD");
    let marginLeft = startDay * 32;
    if (startMonth > 1) {
      marginLeft = (moment(`${startYear}-${startMonth}`).daysInMonth() + startDay) * 32;
    }
  
    const endYear = this.state.endDate.format("Y");
    const endMonth = this.state.endDate.format("MM");
    const endDay = this.state.endDate.format("DD");
    let widthValue = (endDay - startDay) * 32;
    if (endMonth > 1) {
      widthValue = (moment(`${endYear}-${endMonth}`).daysInMonth() + (endDay - startDay)) * 32;
    }

    return (
      <InnerTicket marginLeft={marginLeft} widthValue={widthValue} color={this.stringToColour(this.state.startDate.format("dddd, MMMM Do YYYY"))}>
        <a href={this.state.href} target="_blank">{this.state.id}</a>
      </InnerTicket>
    );
  }
}

export default Ticket;
