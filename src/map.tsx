import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Navbar from "./navbar";
import "leaflet/dist/leaflet.css";
import data from "./data/data.json";
import Scrollbar from "react-smooth-scrollbar";
import L from "leaflet";
import bg from "./assets/bg.png";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import Multiple from "multiple.js";
import { Helmet } from "react-helmet";
import markers from "./assets/markers.png";

interface IMap {
    currentTab: number;
    changeTab: any;
}

export function AddLibrary(urlOfTheLibrary: string) {
    const script = document.createElement("script");
    script.src = urlOfTheLibrary;
    script.async = true;
    document.body.appendChild(script);
}

const Map: React.FC<IMap> = ({currentTab, changeTab}: IMap): JSX.Element => {

    const [found, setFound] = useState<number[]>([]);
    const [expand, setExpand] = useState<boolean>(false);
    const active: any = {};
    const mapRef = useRef<any>(null);
    let map: any;

    const image = Object.fromEntries(Object.entries(data.marker_pos).map(([i, e]) => [i, {
        url: markers,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        size: new google.maps.Size(36, 48),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        origin: new google.maps.Point(0, e),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        anchor: new google.maps.Point(0, 48)
    }]));

    useEffect(() => {
        new Multiple({
            selector: ".section",
            background: `url(${bg}), linear-gradient(104deg, #4C7F9B 20.53%, #0E1E3E 100%)`
        });
        function initMap() {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            map = new google.maps.Map(document.getElementById("map"), {
                center: { 
                    lat: 0.75736599921177,
                    lng: -0.68149126464823,
                },
                backgroundColor: "#170129",
                zoom: 14,
                streetViewControl: false,
                mapTypeControlOptions: {
                    mapTypeIds: ["moon"],
                },
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const moonMapType = new google.maps.ImageMapType({
                getTileUrl: function (coord: any, zoom: number) {
                    const normalizedCoord = getNormalizedCoord(coord, zoom);
          
                    if (!normalizedCoord) {
                        return "";
                    }

                    return (
                        "https://cdn.mapgenie.io/images/tiles/genshin-impact/teyvat/default-v7" +
                  "/" +
                  zoom +
                  "/" +
                  normalizedCoord.x +
                  "/" +
                  normalizedCoord.y +
                  ".png"
                    );
                },
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                tileSize: new google.maps.Size(256, 256),
                maxZoom: 17,
                minZoom: 10,
                radius: 1738000,
                name: "Moon",
            });
          
            map.mapTypes.set("moon", moonMapType);
            map.setMapTypeId("moon");
        }
          
        // Normalizes the coords that tiles repeat across the x axis (horizontally)
        // like the standard Google map tiles.
        function getNormalizedCoord(coord: any, zoom: number) {
            const y = coord.y;
            let x = coord.x;
            // tile range in one direction range is dependent on zoom level
            // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
            const tileRange = 1 << zoom;
          
            // don't repeat across y-axis (vertically)
            if (y < 0 || y >= tileRange) {
                return null;
            }
          
            // repeat across x-axis
            if (x < 0 || x >= tileRange) {
                x = ((x % tileRange) + tileRange) % tileRange;
            }
            return { x: x, y: y };
        }
        initMap();
    }, []);

    const addMarker = (id: number) => {
        active[id+""] = data.locations.filter(e => e.category_id === id).map(e => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const myLatlng = new google.maps.LatLng(parseFloat(e.latitude), parseFloat(e.longitude));
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const marker = new google.maps.Marker({
                position: myLatlng,
                title: e.title,
                icon: image[e.category_id]
            });
            marker.setMap(map);
            return marker;
        });
        console.log(active);
    };

    const removeMarker = (id: number) => {
        active[id+""].map((e: any) => {
            e.setMap(null);
        });
        delete active[id+""];
        console.log(active);
    };
    
    return <>
        <Navbar currentTab={currentTab} changeTab={changeTab}/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/multiple.js/0.0.1/multiple.min.css"/>
        <div className={"pt-16 transition-all duration-500 section relative " + (expand ? "w-full pr-6" : "w-0 pr-0")}>
            <Scrollbar className={"overflow-y-auto transition-all duration-500 flex flex-col pb-9 " + (expand ? "px-6" : "px-0")} style={{height: "calc(100vh - 4rem)"}} alwaysShowTracks={true}>
                {data.groups.map(({title, categories}) => <div key={title}>
                    <h2 className="text-genshin-white text-3xl mb-4 whitespace-nowrap">{title}</h2>
                    <div className="flex flex-col gap-3 mb-16">
                        {categories.map(({id, title, icon}) => 
                            <div key={id} className={"flex items-center justify-between item pl-4 cursor-pointer pr-6 py-3 rounded-lg transition-colors "} onClick={() => Object.keys(active).includes(id+"") ? removeMarker(id) : addMarker(id)}>
                                <div className="flex items-center gap-4 mr-12 whitespace-nowrap">
                                    <p className="text-genshin-white text-xl whitespace-nowrap flex items-center gap-4"><span className={"icon-"+icon}></span>{title}</p>
                                </div>
                                <p className="text-3xl mt-1 text-genshin-lightblue">{data.locations.filter(e => e.category_id == id).length}</p>
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
            <div id="map" className="w-full h-screen"></div>
        </div>
    </>;
};

export default Map;