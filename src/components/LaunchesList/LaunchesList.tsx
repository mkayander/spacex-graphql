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

  padding: 2rem;

  li:not(:first-child) {
    margin-left: 1.25rem;
  }
`;

const Item = styled.li`
  position: relative;
  display: flex;
  flex-flow: column-reverse wrap;
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

  :after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(to top, black 20%, transparent 100%);
    opacity: 0.7;
    z-index: 2;
  }

  .content {
    display: flex;
    flex-flow: column nowrap;
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
        {data?.launchesPast &&
          [...data.launchesPast]
            .sort((a, b) => b?.launch_date_unix - a?.launch_date_unix)
            .map(val => (
              <Item key={val?.id}>
                <img className="bg" src={val?.links?.mission_patch || undefined} alt="Mission patch" />
                <div className="content">
                  <h5>{val?.mission_name}</h5>
                  <p>{new Date(val?.launch_date_utc).toLocaleDateString()}</p>
                  <a href={val?.links?.video_link || undefined} target="_blank" rel="noreferrer">
                    YouTube Video
                  </a>
                </div>
              </Item>
            ))}
      </List>
    </ScrollContainer>
  );
};

export default LaunchesList;
