import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import apollo from "./api/apollo";
import { LAUNCHES_PAST } from "./api/queries";
import { LaunchesList } from "./components";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    useEffect(() => {
        apollo
            .query({
                query: LAUNCHES_PAST,
            })
            .then(result => console.log(result));
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
                <LaunchesList />
            </header>
        </div>
    );
}

export default App;
