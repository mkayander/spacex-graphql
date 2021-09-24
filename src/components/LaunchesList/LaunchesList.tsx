import React, { useEffect } from "react";

import styled from "styled-components";
import { useScrollBoost } from "react-scrollbooster";
import { getYouTubeThumbnailImageUrls } from "../../api/utils";
import { useAppSelector } from "../../store/hooks";
import { fetchNextLaunches, Launch, selectLaunches } from "../../store/slices/launchesSlice";
import { useDispatch } from "react-redux";
import cooldown from "../../utils/cooldown";
import { Spinner } from "../index";
import throttle from "../../utils/throttle";
import { ScrollingState } from "scrollbooster";

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

const Overlay = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
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
    const runUpdate = cooldown(() => {
      console.log("Fetch next!!");
      dispatch(fetchNextLaunches());
    }, 2000);

    const onUpdate =
      !isFull && !loading && data.length > 0
        ? throttle((ev: ScrollingState) => {
            if (ev.borderCollision.right) {
              runUpdate();
            }
          }, 8)
        : null;

    onUpdate &&
      scrollBooster?.updateOptions({
        onUpdate,
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
      {loading && (
        <Overlay>
          <Spinner />
        </Overlay>
      )}
      <List>
        {[...data].map(
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
