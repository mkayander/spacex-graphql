import React, { useEffect } from "react";

import styled from "styled-components";
import { useScrollBoost } from "react-scrollbooster";
import { getYouTubeThumbnailImageUrls } from "../../api/utils";
import { useAppSelector } from "../../store/hooks";
import { fetchNextLaunches, Launch, selectLaunches } from "../../store/slices/launchesSlice";
import { useDispatch } from "react-redux";

const Viewport = styled.div`
  position: relative;
  height: 600px;
`;

const List = styled.ul`
  height: 100%;
  min-width: 100vw;
  display: flex;
  flex-flow: row nowrap;

  & > *:first-child {
    padding-left: 4rem;
  }

  & > *:last-child {
    padding-right: 4rem;
  }
`;

const Item = styled.li`
  padding: 0 1rem;
  display: flex;
`;

const Card = styled.div`
  transition: 0.3s;
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

  &:hover {
    transform: scale(1.1);
    z-index: 10;

    box-shadow: rgba(50, 80, 134, 0.38) 0 3px 20px 0;

    &:after {
      opacity: 0.5;
    }
  }

  &:after {
    transition: opacity 0.3s;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(to top, black 0%, transparent 50%);
    opacity: 0.9;
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

const Spinner = styled.div`
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  height: 80px;
  width: 80px;

  z-index: 1000;

  &:after {
    content: "";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid;
    border-color: #fcf #fcf #fcf transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }

  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LaunchesList: React.FC = () => {
  const { loading, data, isFull } = useAppSelector(selectLaunches);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNextLaunches());
  }, [dispatch]);

  const [viewport, scrollBooster] = useScrollBoost({
    direction: "horizontal",
    friction: 0.1,
    scrollMode: "transform",
  });

  useEffect(() => {
    scrollBooster?.updateOptions({
      onUpdate: ev => {
        if (!isFull && data.length > 0 && ev.borderCollision.right && !loading) {
          console.log("Fetch next!!");
          dispatch(fetchNextLaunches());
        }
      },
    });
  }, [data.length, dispatch, isFull, loading, scrollBooster]);

  const getImageUrl = (item: Launch) => {
    const flickr_images = item?.links?.flickr_images;
    if (flickr_images && flickr_images.length > 0) {
      return flickr_images[0];
    } else {
      const youtubeLink = item?.links?.video_link;
      if (youtubeLink && youtubeLink.length > 8) {
        return getYouTubeThumbnailImageUrls(youtubeLink);
      }
    }
  };

  return (
    <Viewport ref={viewport}>
      {loading && <Spinner />}
      <List>
        {[...data]
          // .sort((a, b) => b?.launch_date_unix - a?.launch_date_unix)
          .map(
            val =>
              val && (
                <Item key={val.id}>
                  <Card>
                    <img className="bg" src={getImageUrl(val) || undefined} alt="Mission card background" />
                    <div className="content">
                      <h5>${val.id}</h5>
                      <h5>{val?.mission_name}</h5>
                      <p>{new Date(val?.launch_date_unix * 1000).toLocaleDateString()}</p>
                      <a href={val?.links?.video_link || undefined} target="_blank" rel="noreferrer">
                        YouTube Video
                      </a>
                    </div>
                  </Card>
                </Item>
              )
          )}
      </List>
    </Viewport>
  );
};

export default LaunchesList;
