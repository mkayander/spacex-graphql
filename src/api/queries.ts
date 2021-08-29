import { gql } from "@apollo/client";

export const LAUNCHES_PAST = gql`
    query GetLaunches {
        launchesPast(limit: 10) {
            mission_name
            launch_date_local
            launch_site {
                site_name_long
            }
            links {
                article_link
                video_link
            }
        }
    }
`;
