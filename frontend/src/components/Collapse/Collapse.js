import React from "react";
import styled from 'styled-components';

const InnerColappse = styled.div`
  display: flex;
  width: 100%;
`;
  
const Heading = styled.div`
  width: ${props => (props.isEpicList ? (props.open ? "150px": "300px") : "146px")};
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
  // position: ${props => (props.open && props.isAssignList ? "fixed" : "")};
  // margin-left: ${props => (props.open && props.isAssignList ? "150px" : "0")};
  border-top: none;
  // width: 100%;
  z-index: 99999999;
  opacity: ${props => (props.open ? "1" : "0")};
  // opacity: ${props => (props.open && props.isAssignList ? "0" : "1")};
  display: ${props => (props.open ? "block" : "none")};
  max-height: ${props => (props.open ? "100%" : "0")};
  overflow: hidden;
  transition: all 0.2s;

  p {
    margin: 0;
  }
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
