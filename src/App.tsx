import React, { useEffect } from "react";
import apollo from "./api/apollo";
import { LaunchesList } from "./components";

import "bootstrap/dist/css/bootstrap.min.css";
import { GetLaunchesDocument, GetLaunchesQuery, GetLaunchesQueryVariables } from "./api/generated/queries";
import { Container } from "react-bootstrap";
import styles from "./App.module.scss";

function App() {
  useEffect(() => {
    apollo
      .query<GetLaunchesQuery, GetLaunchesQueryVariables>({
        query: GetLaunchesDocument,
        variables: { limit: 10, offset: 0 },
      })
      .then(result => console.log(result));
  }, []);

  return (
    <div className={styles.root}>
      <Container>
        <h1>Explore Space-X launches!</h1>
      </Container>
      <LaunchesList />
    </div>
  );
}

export default App;
