import React from "react";
import { Container } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { LAUNCHES_PAST } from "../../api/queries";

const LaunchesList = () => {
    const { loading, data, error } = useQuery(LAUNCHES_PAST);

    console.log(loading, data, error);

    return (
        <Container>
            {loading && <h5>Loading data...</h5>}
            <ul>
                {data?.launchesPast?.map((val: any) => (
                    <li>
                        <p>{JSON.stringify(val)}</p>
                    </li>
                ))}
            </ul>
        </Container>
    );
};

export default LaunchesList;
