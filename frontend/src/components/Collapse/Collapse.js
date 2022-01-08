import React from "react";
import styled from 'styled-components';
import Ticket from '../Ticket/Ticket';

const Heading = styled.div`
  width: 200px;
  border: 1px solid #ddd;
  color: white;
  margin: 0;
  cursor: pointer;
`;

const Assign = styled.p`
  color: black;
  margin: 0;
  cursor: pointer;
`;

const Content = styled.div`
  border-top: none;
  margin-left: 200px;
  width: 100%;
  opacity: ${props => (props.open ? "1" : "0")};
  max-height: ${props => (props.open ? "100%" : "0")};
  overflow: hidden;
  transition: all 0.1s;

  p {
    margin: 0;
  }
`;

class Collapse extends React.Component {

  constructor(props) {
    super(props);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.state = {
      assign: props.assign
    };
  }

  toggleOpen() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const ticketsComponents = this.state.assign.tickets.map(ticket => {
      return <Ticket key={ticket.id} ticket={ticket}></Ticket>
    });
    return (
      <div>
        <Heading onClick={this.toggleOpen}>
          <Assign>{this.state.assign.name}</Assign>
        </Heading>
        <Content open={this.state.open}>
          {ticketsComponents}
        </Content>
      </div>
    );
  }
}

export default Collapse;
