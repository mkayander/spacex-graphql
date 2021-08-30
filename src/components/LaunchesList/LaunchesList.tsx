import React from "react";
import { useQuery } from "@apollo/client";

import { GetLaunchesDocument, GetLaunchesQuery, GetLaunchesQueryVariables } from "../../api/generated/queries";
import styled from "styled-components";
import { useScrollBoost } from "react-scrollbooster";

const Viewport = styled.div`
  //overflow-x: scroll;
  //display: flex;
  //justify-content: flex-start;
  //align-items: flex-start;
  //position: relative;
  //overflow: hidden;
  //text-align: left;
  //overflow-x: scroll;
`;

const List = styled.ul`
  height: 600px;
  //width: 100%;
  min-width: 100vw;
  //position: relative;
  //justify-content: flex-start;
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
  border-radius: 6px;
  background: #292f3b;

  box-shadow: #191c21 0 3px 10px 0;

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
    background: linear-gradient(to top, black 0%, transparent 50%);
    opacity: 0.7;
    z-index: 2;
  }

  .content {
    display: flex;
    flex-flow: column nowrap;
    z-index: 5;
    padding: 1.75rem;

    h5 {
      margin-bottom: 0;
    }

    p {
      margin-bottom: 0.25rem;
    }

    a {
      color: inherit;
      font-weight: bold;
    }
  }
`;

const LaunchesList = () => {
  const { loading, data, error } = useQuery<GetLaunchesQuery, GetLaunchesQueryVariables>(GetLaunchesDocument, {
    variables: { limit: 10 },
  });

  if (error) console.error(error);

  const [viewport, scrollbooster] = useScrollBoost({
    direction: "horizontal",
    friction: 0.1,
    scrollMode: "transform",
    // ...optional options
  });

  console.log(viewport, scrollbooster);

  if (loading) return <h5>Loading data...</h5>;

  return (
    // <ScrollContainer
    //   className={styles.root}
    //   vertical={false}
    //   horizontal={true}>
    <Viewport ref={viewport}>
      <List>
        {data?.launchesPast &&
          [...data.launchesPast]
            .sort((a, b) => b?.launch_date_unix - a?.launch_date_unix)
            .map(val => (
              <Item key={val?.id}>
                <img
                  className="bg"
                  src={val?.links?.flickr_images?.find((_, index) => index === 0) || undefined}
                  alt="Mission card background"
                />
                <div className="content">
                  <h5>{val?.mission_name}</h5>
                  <p>{new Date(val?.launch_date_unix * 1000).toLocaleDateString()}</p>
                  <a href={val?.links?.video_link || undefined} target="_blank" rel="noreferrer">
                    YouTube Video
                  </a>
                </div>
              </Item>
            ))}
      </List>
    </Viewport>
    // </ScrollContainer>
  );
};

export default LaunchesList;
