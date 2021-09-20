import React, { useEffect, useRef, useState } from "react";
import Map from "./map";
import Character from "./character";
import "./style/main.scss";

function App(): JSX.Element {
    const [currentTab, changeTab] = useState<number>(0);
    const charBtn = useRef(null);
    
    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/multiple.js/0.0.1/multiple.min.css"/>
            <main className="flex justify-between relative">
                {
                    (() => {
                        let tab: JSX.Element;
                        switch (currentTab) {
                        case 0: tab = <Map currentTab={currentTab} changeTab={changeTab}/>; break;
                        case 1: tab = <Character currentTab={currentTab} changeTab={changeTab}/>; break;
                        default: tab = <Map currentTab={currentTab} changeTab={changeTab}/>;
                        }
                        return tab;
                    })()
                }
            </main>
        </>
    );
}

export default App;
