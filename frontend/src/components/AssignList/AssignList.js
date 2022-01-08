import React from "react";
import styled from 'styled-components';
import Collapse from '../Collapse/Collapse';
import moment from 'moment';

const InnerAssignList = styled.div`
  position: absolute;
  top: 50px;
  width: 100%;
`;

class AssignList extends React.Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    // MockData
    this.state = { list: [
      {
        name: "Renato Trevisan",
        tickets: [
          {
            id: "TEST-0001",
            href: "https://test.com/TEST-0001",
            startDate: moment("2021-01-01"),
            endDate: moment("2021-01-7")
          },
          {
            id: "TEST-0002",
            href: "https://test.com/TEST-0002",
            startDate: moment("2021-01-7"),
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
            startDate: moment("2021-01-1"),
            endDate: moment("2021-01-14")
          },
          {
            id: "TEST-0004",
            href: "https://test.com/TEST-0004",
            startDate: moment("2021-01-14"),
            endDate: moment("2021-01-31")
          }
        ]
      }
    ]};
  }

  render() {
    const components = this.state.list.map((assign) => {
      return <Collapse key={assign.name} assign={assign}></Collapse>
    });
    return (
      <InnerAssignList ref={this.ref}>
        {components}
      </InnerAssignList>
    );
  }
}

export default AssignList;
