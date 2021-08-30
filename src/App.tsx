import React, { useEffect, useState } from "react";
import Map from "./map";
import Navbar from "./navbar";
import Character from "./character";
import "./style/main.scss";

function App(): JSX.Element {
    const [currentTab, changeTab] = useState<number>(0);
    
    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/multiple.js/0.0.1/multiple.min.css"/>
            <main className="flex justify-between relative">
                <Navbar currentTab={currentTab} changeTab={changeTab}/>
                {
                    (() => {
                        let tab: JSX.Element;
                        switch (currentTab) {
                        case 0: tab = <Map/>; break;
                        case 1: tab = <Character/>; break;
                        default: tab = <Map/>;
                        }
                        return tab;
                    })()
                }
            </main>
        </>
    );
}

export default App;
