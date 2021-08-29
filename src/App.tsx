import React, { useEffect } from "react";
import "./App.css";
import apollo from "./api/apollo";
import { LaunchesList } from "./components";

import "bootstrap/dist/css/bootstrap.min.css";
import { GetLaunchesDocument } from "./api/generated/queries";
import { Container } from "react-bootstrap";

function App() {
  useEffect(() => {
    apollo
      .query({
        query: GetLaunchesDocument,
      })
      .then(result => console.log(result));
  }, []);

  return (
    <div className="App">
      <Container>
        <h1>Explore Space-X launches!</h1>
      </Container>
      <LaunchesList />
    </div>
  );
}

export default App;
