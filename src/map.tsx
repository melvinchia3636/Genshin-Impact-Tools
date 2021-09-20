import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Navbar from "./navbar";
import "leaflet/dist/leaflet.css";
import types from "./data/type/type.json";
import marks from "./data/type/marks.json";
import Scrollbar from "react-smooth-scrollbar";
import L from "leaflet";
import bg from "./assets/bg.png";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import Multiple from "multiple.js";

interface IMap {
    currentTab: number;
    changeTab: any;
}

const Map: React.FC<IMap> = ({currentTab, changeTab}: IMap): JSX.Element => {

    const [found, setFound] = useState<number[]>([]);
    const [expand, setExpand] = useState<boolean>(false);
    const mapRef = useRef<any>(null);

    const typesList: {
        type: string,
        item: {
            name: string,
            amount?: number,
            state: {
                active: boolean,
                setActive: any
            }
        }[]
    }[] = [];

    types.forEach(e => {
        !typesList.some(f => f.type === (e.level === "NewUpdate" ? "New Updates" : e.level)) ? typesList.push({
            type: e.level === "NewUpdate" ? "New Updates" : e.level,
            item: [{
                name: e.type,
                amount: marks.filter(f => f.type === e.type).length,
                state: (() => {
                    const [active, setActive] = useState<boolean>(false);
                    return {
                        active,
                        setActive
                    };
                })()
            }]
        }) : typesList[typesList.map(e => e.type).indexOf(e.level === "NewUpdate" ? "New Updates" : e.level)].item.push({
            name: e.type,
            amount: marks.filter(f => f.type === e.type).length,
            state: (() => {
                const [active, setActive] = useState<boolean>(false);
                return {
                    active,
                    setActive
                };
            })()
        });
    });

    useEffect(() => {
        new Multiple({
            selector: ".section",
            background: `url(${bg}), linear-gradient(104deg, #4C7F9B 20.53%, #0E1E3E 100%)`
        });
    }, []);
    
    return <>
        <Navbar currentTab={currentTab} changeTab={changeTab}/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/multiple.js/0.0.1/multiple.min.css"/>
        <div className={"pt-16 transition-all duration-500 section relative " + (expand ? "w-full pr-6" : "w-0 pr-0")}>
            <Scrollbar className={"overflow-y-auto transition-all duration-500 flex flex-col " + (expand ? "px-6" : "px-0")} style={{height: "calc(100vh - 4rem)"}} alwaysShowTracks={true}>
                {typesList.map(({type, item}) => <div key={type}>
                    <h2 className="text-genshin-white text-3xl mb-4 whitespace-nowrap">{type}</h2>
                    <div className="flex flex-col gap-3 mb-16">
                        {item.map(({name, amount, state}) => 
                            <div key={name} className={"flex items-center justify-between item pl-4 cursor-pointer pr-6 py-3 rounded-lg transition-colors "+(state.active ? "active" : "")}  onClick={() => state.setActive(!state.active)} >
                                <div className="flex items-center gap-4 mr-12 whitespace-nowrap">
                                    <img src={`https://map.genshinpact.com/markers/${name}.png`} className="w-12 h-12"/>
                                    <p className="text-genshin-white text-xl whitespace-nowrap">{name}</p>
                                </div>
                                <p className="text-3xl mt-1 text-genshin-lightblue">{amount}</p>
                            </div>
                        )}
                    </div>
                </div>)}
            </Scrollbar>
            <button className="py-8 pr-4 section absolute -right-11 rounded-r-md top-1/2 transform -translate-y-1/2" style={{zIndex: 9999}} onClick={() => {
                setExpand(!expand);
            }}>
                {expand ? 
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.8em" height="1.8em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 576 512"><path d="M0 117.66v346.32c0 11.32 11.43 19.06 21.94 14.86L160 416V32L20.12 87.95A32.006 32.006 0 0 0 0 117.66zM192 416l192 64V96L192 32v384zM554.06 33.16L416 96v384l139.88-55.95A31.996 31.996 0 0 0 576 394.34V48.02c0-11.32-11.43-19.06-21.94-14.86z" fill="rgb(240, 243, 229)"/></svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.8em" height="1.8em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path d="M48 48a48 48 0 1 0 48 48a48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48a48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48a48 48 0 0 0-48-48zm448 16H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z" fill="rgb(240, 243, 229)"/></svg>
                }
            </button>
        </div>
        <div className="w-full section">
            <MapContainer center={[65, -40]} zoom={4} minZoom={3} maxZoom={6} className="w-full h-screen" whenCreated={ mapInstance => { mapRef.current = mapInstance; }}>
                <TileLayer url="https://map.genshinpact.com/tiles/{z}/{x}/{y}.png"/>
                {typesList.map(e => e.item)
                    .flat()
                    .filter(e => e.state.active)
                    .map(e => marks.filter(f => f.type === e.name))
                    .flat()
                    .map(e => <Marker key={e.markerid} position={[parseFloat(e.lat), parseFloat(e.lon)]} icon={
                        new L.Icon({
                            iconUrl: `https://map.genshinpact.com/markers/${e.type}.png`,
                            iconRetinaUrl: `https://map.genshinpact.com/markers/${e.type}.png`,
                            iconSize: new L.Point(24, 24),
                            className:  (found.includes(parseInt(e.markerid, 10)) ? "opacity-50" : "") + " marker transition-all"
                        })
                    }>
                        <Popup>
                            <h3 className="text-center mb-2 text-lg text-genshin-lighterblue">{e.type} #{e.markerid}</h3>
                            <img src={e.imageurl} className="rounded-sm w-full mb-4 max-w-none"/>
                            <h4 className="text-genshin-lighterblue mb-1">Share Link</h4>
                            <div className="flex items-center gap-4 py-3 px-4 rounded-md text-genshin-lighterblue bg-genshin-mediumblue mb-4">
                                https://genshin.thecodeblog.net/map#{e.markerid}
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.2rem" height="1.2rem" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M15 20H5V7c0-.55-.45-1-1-1s-1 .45-1 1v13c0 1.1.9 2 2 2h10c.55 0 1-.45 1-1s-.45-1-1-1zm5-4V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2zm-2 0H9V4h9v12z" fill="currentColor"/></svg>
                                </button>
                            </div>
                            <button className="text-lg text-genshin-lightblue bg-genshin-white w-full py-2 text-center rounded-full" onClick={() => {
                                const id = parseInt(e.markerid, 10);
                                if (found.includes(id)) {
                                    setFound(found.filter(e => e !== id));
                                } else {
                                    setFound(found.concat([parseInt(e.markerid, 10)]));
                                }
                            }}>Mark As {found.includes(parseInt(e.markerid, 10)) ? "Unfound" : "Found"}</button>
                        </Popup>
                    </Marker>)
                }
            </MapContainer>
        </div>
    </>;
};

export default Map;