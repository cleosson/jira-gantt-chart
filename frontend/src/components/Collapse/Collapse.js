import React from "react";
import styled from 'styled-components';

const InnerColappse = styled.div`
  display: flex;
`;
  
const Heading = styled.div`
  width: ${props => (props.isEpicList ? (props.open ? "150px": "298px") : "146px")};
  border: 1px solid #ddd;
  color: white;
  margin: 0;
  cursor: pointer;
`;

const Assign = styled.p`
  color: black;
  margin: 0;
  cursor: pointer;
  text-align: center;
`;

const Content = styled.div`
  border-top: none;
  z-index: 99999999;
  opacity: ${props => (props.open ? "1" : "0")};
  display: ${props => (props.open ? "block" : "none")};
  max-height: ${props => (props.open ? "100%" : "0")};
  overflow: hidden;
  transition: all 0.2s;
`;

const Collapse = ({ isEpicList, isAssignList, data, open, onClick, contentComponents }) => {
  return (
    <InnerColappse open={open}>
      <Heading isEpicList={isEpicList} open={open} onClick={onClick}>
        <Assign>{data.name}</Assign>
      </Heading>
      <Content isAssignList={isAssignList} open={open}>
        {contentComponents}
      </Content>
    </InnerColappse>
  )
};

export default Collapse;
