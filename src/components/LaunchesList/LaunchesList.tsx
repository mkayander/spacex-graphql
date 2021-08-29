import React from "react";
import { useQuery } from "@apollo/client";

import { GetLaunchesDocument, GetLaunchesQuery } from "../../api/generated/queries";
import styled from "styled-components";
import ScrollContainer from "react-indiana-drag-scroll";
import styles from "./LaunchesList.module.scss";

const List = styled.ul`
  height: 600px;
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  //overflow-x: scroll;

  padding: 2rem 0;

  li:not(:first-child) {
    margin-left: 1.25rem;
  }
`;

const Item = styled.li`
  position: relative;
  display: flex;
  flex-flow: column wrap;
  min-width: 500px;
  overflow: hidden;
  background: #292f3b;

  box-shadow: #191c21 0 3px 6px 0;

  .bg {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .content {
    z-index: 5;
    padding: 1.75rem;
  }
`;

const LaunchesList = () => {
  const { loading, data, error } = useQuery<GetLaunchesQuery>(GetLaunchesDocument);

  console.log(loading, data, error);

  if (loading) return <h5>Loading data...</h5>;

  return (
    <ScrollContainer className={styles.root} vertical={false} horizontal={true}>
      <List>
        {data?.launchesPast?.map(val => (
          <Item key={val?.id}>
            <img className="bg" src={val?.links?.mission_patch || undefined} alt="Mission patch" />
            <div className="content">
              <h5>{val?.mission_name}</h5>
            </div>
          </Item>
        ))}
      </List>
    </ScrollContainer>
  );
};

export default LaunchesList;
