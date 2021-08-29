import React from "react";
import { Route, Switch } from "react-router-dom";
import Landing from "./map";
import "./style/main.scss";

function App(): JSX.Element {
    return (
        <>
            <main>
                <Route>
                    <Switch>
                        <Route exact path="/"><Landing/></Route>
                        <Route exact path="/home"><Landing/></Route>
                    </Switch>
                </Route>
            </main>
        </>
    );
}

export default App;
