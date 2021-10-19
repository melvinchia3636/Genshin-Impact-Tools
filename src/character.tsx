/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect } from "react";
import { useState } from "react";
import * as Elements from "./assets/elements";
import * as Weapons from "./assets/weapons";
import CharacterData from "./data/character/data.json";
import * as CharacterImages from "./assets/characters/icon";
import Scrollbar from "react-smooth-scrollbar";
import Navbar from "./navbar";
import VisibilitySensor from "react-visibility-sensor";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import ReactMarkdown from "react-markdown";

const elements = Object.fromEntries(Object.entries(Elements));
const weapons = Object.fromEntries(Object.entries(Weapons));
const images = Object.fromEntries(Object.entries(CharacterImages));

interface ICharIndex {
    setSelectedChar: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface ICharInfo {
    selectedChar: string;
    setSelectedChar: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface IBullet {
    color: string
    size?: number
}

interface IProfile {
    data: any
    setIsAuto: any
    changeSubSection: any
    first: boolean
}

interface ICombatInfo {
    data: any
    setIsAuto: any
    changeSubSection: any
    first: boolean
}

interface IAvailability {
    data: any
    setIsAuto: any
    changeSubSection: any
    first: boolean
}

interface IStories {
    data: any
    setIsAuto: any
    changeSubSection: any
    first: boolean
}

interface ICharBanner {
    data: any
}

const Bullet:React.FC<IBullet> = ({color, size}: IBullet): JSX.Element => {
    return <svg className="transition-all" width={size || "27"} height={size || "27"} viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.707107" y="13.3553" width="17.8873" height="17.8873" transform="rotate(-45 0.707107 13.3553)" stroke={color}/>
        <path d="M23.3554 13.3553L13.3553 3.35531V23.3554L23.3554 13.3553Z" fill={color}/>
    </svg>;
};

const CharBanner: React.FC<ICharBanner> = ({data}: ICharBanner):JSX.Element => {
    let banner: string;
    try {banner = require(`./assets/characters/banner/${data.name.replace(/\s/g, "_")}.png`).default;}
    catch {banner = "";}
    const icon = require(`./assets/characters/icon/${data.name.replace(/\s/g, "_").toLowerCase()}.png`).default;

    return <div style={banner ? {backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2) ), url(${banner})`} : {}} className="w-full bg-no-repeat bg-cover bg-bottom rounded-bl-xl flex items-center justify-between">
        <div className="flex items-center">
            <img src={icon} className="p-8"/>
            <div>
                <h1 className="text-genshin-white text-5xl mt-1 whitespace-nowrap">{data.name}</h1>
                <p className="text-genshin-white text-xl mt-2 tracking-wider">{data.nickname}</p>
            </div>
        </div>
        <p className="p-8 text-genshin-white text-3xl">{data.profile.bio.rarity} ✦</p>
    </div>;
};

const CharacterIndex:React.FC<ICharIndex> = ({setSelectedChar}: ICharIndex): JSX.Element => {
    const [currentSection, changeTab] = useState<number>(0);
    return <div className="section w-full h-screen flex">
        <div className="items-center justify-between py-16 flex flex-col border-l-2 border-r-2 border-genshin-white h-full w-24" style={{background: "linear-gradient(180deg, rgba(146, 181, 201, 0.8) 28.55%, rgba(146, 181, 201, 0.24) 100%)"}}>
            {Object.entries(elements).map(([name, Com], i) => <button key={name} onClick={() => changeTab(i)}><Com {...(currentSection === i ? {} : {color: "white"})} size={42}/></button>)}
        </div>
        <Scrollbar className="w-full py-10 px-12 h-screen overflow-y-auto">
            {(() => {
                const [name, Element] = Object.entries(elements)[currentSection];
                return <h1 className="flex items-center gap-4 text-genshin-white text-4xl">
                    <Element size={52}/>
                    {name}
                </h1>;
            })()}
            <div className="flex flex-col gap-2 mt-8">
                <div className="w-full flex pl-2 pr-6 items-center text-genshin-lighterblue overflow-hidden">
                    <p className="text-md mb-1 mt-1 w-6/12">Character Name</p>
                    <p className="text-md mb-1 mt-1 w-2/12">Rarity</p>
                    <p className="text-md mb-1 mt-1 w-3/12 flex">Weapon</p>
                    <p className="text-md mb-1 mt-1 w-3/12 flex">Gender</p>
                    <p className="text-md mb-1 mt-1 w-3/12 flex">Birthday</p>
                </div>
                {CharacterData.filter(e => e.vision === Object.entries(elements)[currentSection][0].toLocaleLowerCase()).map(({ name, weapon, rarity, gender, birthday }) => 
                    <div key={name} className="bg-genshin-reallylightblue bg-opacity-30 transition-all duration-300 cursor-pointer item w-full flex p-2 pr-6 items-center rounded-md text-genshin-white overflow-hidden" onClick={() => setSelectedChar(name)}>
                        <div className="flex items-center w-6/12">
                            <div className="rounded-sm rounded-br-2xl p-2 shadow-md" style={{background: (rarity === 4 ? "#966DB1" : "#d08434")}}><img className="w-10 h-10" src={images[name.toLowerCase().replace(/\s/g, "_")]}/></div>
                            <h2 className="text-2xl ml-4">{name}</h2>
                        </div>

                        <p className="text-xl mt-1 w-2/12">{rarity} ✦</p>
                        <p className="text-xl font-rubik mt-1 w-3/12 flex items-center gap-2">
                            <img className="w-6 h-6" src={weapons[weapon]}/>
                            {weapon}
                        </p>
                        <p className="text-xl font-rubik mt-1 w-3/12 flex items-center gap-2">
                            {gender === "male" ?
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.2em" height="1.2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M6.864 17.136a5 5 0 1 0 7.071-7.071a5 5 0 0 0-7.071 7.071zm7.728-9.142l2.553-2.553h-1.517a1 1 0 0 1 0-2h4a.997.997 0 0 1 1 1v4a1 1 0 1 1-2 0V6.786l-2.622 2.622A7.002 7.002 0 0 1 5.45 18.55a7 7 0 0 1 9.142-10.556z" fill="currentColor"/></svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.2em" height="1.2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M12 14a5 5 0 1 0 0-10a5 5 0 0 0 0 10zm1 4h1a1 1 0 0 1 0 2h-1v1a1 1 0 0 1-2 0v-1h-1a1 1 0 0 1 0-2h1v-2c0-.024 0-.047.002-.07A7.002 7.002 0 0 1 12 2a7 7 0 0 1 .998 13.93L13 16v2z" fill="currentColor"/></svg>
                            }
                            {gender}
                        </p>
                        <p className="text-xl font-rubik mt-1 w-3/12">{birthday}</p>
                    </div>
                )}
            </div>
        </Scrollbar>
    </div>;
};

const Profile: React.FC<IProfile> = ({data, setIsAuto, changeSubSection, first}: IProfile):JSX.Element => {
    const images =  ["card", "portrait", "ingame"].map(e => require(`./assets/characters/${e}/${data.name.replace(/\s/g, "_")}.png`).default);
    const Element = elements[data.profile.bio.element];
    const [imageType, setImageType] = useState(0);
    
    return <div className="w-full ml-6 h-screen overflow-y-auto" style={{flexShrink: 9999}}>
        <CharBanner data={data}/>
        <div className="pb-12 pl-4 pr-12">
            <VisibilitySensor
                onChange={(isVisible) => {
                    if (isVisible && !first) {
                        setIsAuto(true);
                        changeSubSection(0);
                    }
                }}
            >
                <>
                    <div className="flex gap-24 items-center h-16 pt-8" id="0-0">
                        <div className={"tracking-wider transition-all cursor-pointer "+(imageType === 0 ? "text-genshin-white text-3xl" : "text-genshin-detailsblue")} style={imageType !== 0 ? {fontSize: "1.4rem"} : {}} onClick={() => setImageType(0)}>Card</div>
                        <div className={"tracking-wider transition-all cursor-pointer "+(imageType === 1 ? "text-genshin-white text-3xl" : "text-genshin-detailsblue")} style={imageType !== 1 ? {fontSize: "1.4rem"} : {}} onClick={() => setImageType(1)}>Portrait</div>
                        <div className={"tracking-wider transition-all cursor-pointer "+(imageType === 2 ? "text-genshin-white text-3xl" : "text-genshin-detailsblue")} style={imageType !== 2 ? {fontSize: "1.4rem"} : {}} onClick={() => setImageType(2)}>In Game</div>
                    </div>
                    <img src={images[imageType]} className="w-full mt-8 rounded-lg"/>
                </>
            </VisibilitySensor>
            <VisibilitySensor
                onChange={(isVisible) => {
                    if (isVisible && !first) {
                        setIsAuto(true);
                        changeSubSection(1);
                    }
                }}
            >
                <>
                    <div className="flex items-center gap-3 pt-16" id="0-1">
                        <Bullet color="#ACCACB"/>
                        <span className="text-genshin-detailsblue text-3xl">Bio</span>
                    </div>
                    <div className="flex flex-col gap-4 mt-6 pl-1">
                        {Object.entries(data.profile.bio).map(([k, v]: any) => <div key={k} className="flex items-center justify-between">
                            <p className="text-genshin-white titlecase tracking-wider" style={{fontSize: "1.4rem"}}>{k.replace(/_/g, " ")}</p>
                            <p className="text-genshin-white text-xl font-rubik titlecase tracking-wider flex items-center gap-2 justify-between">
                                {k === "element" ? <Element size="24"/> : ""}
                                {k === "weapon" ? <img className="w-6" src={weapons[v]}/> : ""}
                                {k === "sex" ? (v === "Male" ?
                                    <svg className="-mr-1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.2em" height="1.2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M6.864 17.136a5 5 0 1 0 7.071-7.071a5 5 0 0 0-7.071 7.071zm7.728-9.142l2.553-2.553h-1.517a1 1 0 0 1 0-2h4a.997.997 0 0 1 1 1v4a1 1 0 1 1-2 0V6.786l-2.622 2.622A7.002 7.002 0 0 1 5.45 18.55a7 7 0 0 1 9.142-10.556z" fill="currentColor"/></svg>
                                    :
                                    <svg className="-mr-1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.2em" height="1.2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M12 14a5 5 0 1 0 0-10a5 5 0 0 0 0 10zm1 4h1a1 1 0 0 1 0 2h-1v1a1 1 0 0 1-2 0v-1h-1a1 1 0 0 1 0-2h1v-2c0-.024 0-.047.002-.07A7.002 7.002 0 0 1 12 2a7 7 0 0 1 .998 13.93L13 16v2z" fill="currentColor"/></svg>
                                ) : ""}
                                {k !== "rarity" ? v : "✦".repeat(parseInt(v, 10))}
                            </p>
                        </div>)}
                    </div>
                </>
            </VisibilitySensor>
            <VisibilitySensor
                onChange={(isVisible) => {
                    if (isVisible && !first) {
                        setIsAuto(true);
                        changeSubSection(2);
                    }
                }}
            >
                <>
                    <div className="flex items-center gap-3 pt-16" id="0-2">
                        <Bullet color="#ACCACB"/>
                        <span className="text-genshin-detailsblue text-3xl">Voice Actors</span>
                    </div>
                    <div className="flex flex-col gap-4 mt-6 pl-1">
                        {Object.entries(data.profile.voice_actors).map(([k, v]: any) => <div key={k} className="flex items-center justify-between">
                            <p className="text-genshin-white titlecase tracking-wider" style={{fontSize: "1.4rem"}}>{k.replace(/_/g, " ")}</p>
                            <p className="text-genshin-white text-xl font-rubik titlecase tracking-wider flex items-center gap-2 justify-between">
                                {v}
                            </p>
                        </div>)}
                    </div>
                </>
            </VisibilitySensor>
            <VisibilitySensor   
                onChange={(isVisible) => {
                    if (isVisible && !first) {
                        setIsAuto(true);
                        changeSubSection(3);
                    }
                }}
            >
                <>
                    <div className="flex items-center gap-3 pt-16" id="0-3">
                        <Bullet color="#ACCACB"/>
                        <span className="text-genshin-detailsblue text-3xl">Introduction</span>
                    </div>
                    <div className="flex gap-4 mt-6 pl-1">
                        <div className="font-rubik leading-none text-genshin-quoteblue mt-16" style={{fontSize: "10rem", lineHeight: ".4rem"}}>“</div>
                        <div className="flex flex-col gap-6">
                            {data.profile.introduction.quote.split("\n").map((e:string) => <div key={e} className="text-genshin-white font-rubik text-xl tracking-wider italic">{e}</div>)}
                            <p className="text-genshin-detailsblue text-xl font-rubik tracking-wider flex items-center gap-3"><span className="block" style={{letterSpacing: "-.15rem"}}>---</span> Description from the Official Website</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 mt-8 pl-1">
                        <div className="text-genshin-white font-rubik text-lg tracking-wider">{data.profile.introduction.content}</div>
                    </div>
                </>
            </VisibilitySensor>
            <VisibilitySensor
                onChange={(isVisible) => {
                    if (isVisible && !first) {
                        setIsAuto(true);
                        changeSubSection(4);
                    }
                }}
            >
                <>
                    <div className="flex items-center gap-3 pt-16" id="0-4">
                        <Bullet color="#ACCACB"/>
                        <span className="text-genshin-detailsblue text-3xl">Personality</span>
                    </div>
                    <div className="flex gap-4 mt-6 pl-1">
                        <div className="font-rubik text-genshin-quoteblue mt-16" style={{fontSize: "10rem", lineHeight: ".4rem"}}>“</div>
                        <div className="flex flex-col gap-6">
                            {data.profile.personality.quote.split("\n").map((e:string) => <div key={e} className="text-genshin-white font-rubik text-xl tracking-wider italic">{e}</div>)}
                            <p className="text-genshin-detailsblue text-xl font-rubik tracking-wider flex items-center gap-3"><span className="block" style={{letterSpacing: "-.15rem"}}>---</span> In-game character attributes and profile page text</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 mt-8 pl-1">
                        {data.profile.personality.content.map((e:string) => <div key={e} className="text-genshin-white font-rubik text-lg tracking-wider ">{e}</div>)}
                    </div>
                </>
            </VisibilitySensor>
            <VisibilitySensor
                onChange={(isVisible) => {
                    if (isVisible && !first) {
                        setIsAuto(true);
                        changeSubSection(5);
                    }
                }}
            >
                <>
                    <div className="flex items-center gap-3 pt-16" id="0-5">
                        <Bullet color="#ACCACB"/>
                        <span className="text-genshin-detailsblue text-3xl">Appearance</span>
                    </div>
                    <div className="flex flex-col gap-6 mt-8 pl-1">
                        {data.profile.appearance.map((e:string) => <div key={e} className="text-genshin-white font-rubik text-lg tracking-wider ">{e}</div>)}
                    </div>
                </>
            </VisibilitySensor>
        </div>
    </div>;
};

const CombatInfo: React.FC<ICombatInfo> = ({data, setIsAuto, changeSubSection, first}: ICombatInfo):JSX.Element => {

    const [ascensionPhase, setAscensionPhase] = useState(0);
    const [baseStats, setBaseStats] = useState(["1", data.combat_info.base_stats.data["0"]["1"]]);
    const ascLevel = [20, 40, 50, 60, 70, 80];
    
    return <div className="w-full ml-6 h-screen overflow-y-auto" style={{flexShrink: 9999}}>
        <div className="pb-12 pl-4 pr-12">
            <VisibilitySensor
                partialVisibility
                onChange={(isVisible) => {
                    if (isVisible && !first) {
                        setIsAuto(true);
                        changeSubSection(0);
                    }
                }}
            >
                <>
                    <CharBanner data={data}/>
                    <div className="flex items-center gap-3 pt-12" id="1-0">
                        <Bullet color="#ACCACB"/>
                        <span className="text-genshin-detailsblue text-3xl">Basic Stats</span>
                    </div>
                    <div className="flex gap-4 mt-6 pl-1 justify-between">
                        <div className="flex flex-col gap-2">
                            <p className="text-genshin-detailsblue text-xl tracking-wider">HP</p>
                            <p className="text-genshin-white text-4xl tracking-wide" style={{fontSize: "2.4rem"}}>{baseStats[1][0]}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-genshin-detailsblue text-xl tracking-wider">ATK</p>
                            <p className="text-genshin-white text-4xl tracking-wide" style={{fontSize: "2.4rem"}}>{baseStats[1][1]}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-genshin-detailsblue text-xl tracking-wider">DEF</p>
                            <p className="text-genshin-white text-4xl tracking-wide" style={{fontSize: "2.4rem"}}>{baseStats[1][2]}</p>
                        </div>
                    </div>
                    <div className="flex mt-10 pl-1 justify-between items-center">
                        <p className="text-genshin-white titlecase tracking-wider whitespace-nowrap w-full" style={{fontSize: "1.4rem"}}>Ascension Phase</p>
                        <div className="flex w-full items-center">
                            <div className="mr-6 text-genshin-white text-2xl">{ascensionPhase}</div>
                            <Slider min={0} max={6} onChange={e => {setAscensionPhase(e); setBaseStats([Object.keys(data.combat_info.base_stats.data[e+""])[0], Object.values(data.combat_info.base_stats.data[e+""])[0]]);}}/>
                        </div>
                    </div>
                    <div className="flex mt-6 pl-1 justify-between">
                        <p className="text-genshin-white titlecase tracking-wider w-full" style={{fontSize: "1.4rem"}}>Level</p>
                        <div className="flex gap-8 w-full items-center">
                            {Object.keys(data.combat_info.base_stats.data[ascensionPhase+""]).map(e => <div key={e} className={"transition-all cursor-pointer " + (e+"" === baseStats[0] ? "text-genshin-white text-2xl" : "text-genshin-detailsblue text-xl")} onClick={() => setBaseStats([e+"", data.combat_info.base_stats.data[ascensionPhase+""][e+""]])}>{e}</div>)}
                        </div>
                    </div>
                </>
            </VisibilitySensor>
            <VisibilitySensor
                onChange={(isVisible) => {
                    if (isVisible && !first) {
                        setIsAuto(true);
                        changeSubSection(1);
                    }
                }}
            >
                <>
                    <div className="flex items-center gap-3 pt-12" id="1-1">
                        <Bullet color="#ACCACB"/>
                        <span className="text-genshin-detailsblue text-3xl">Talents</span>
                    </div>
                    <div className="flex flex-col gap-4 mt-6 pl-1">
                        {data.combat_info.talents.map(({icon, name, type, desc}: {[key: string]: string}) => 
                            <div key="name" className="bg-genshin-cardblue p-6 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <img src={icon} className="w-16 h-16"/>
                                    <div className="mt-1">
                                        <h3 className="text-genshin-white text-3xl">{name}</h3>
                                        <p className="text-genshin-detailsblue text-lg">{type}</p>
                                    </div>
                                </div>
                                <div><ReactMarkdown className="react-markdown">{desc}</ReactMarkdown></div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3 pt-16">
                        <Bullet color="#ACCACB"/>
                        <span className="text-genshin-detailsblue text-3xl">Talent Leveling Materials</span>
                    </div>
                    <div className="flex flex-col gap-4 mt-6 pl-1">
                        <div className="flex flex-col gap-4 mt-6 pl-1">
                            <div className="w-full flex px-6 items-center text-genshin-lighterblue overflow-hidden">
                                <p className="text-md mb-1 mt-1 w-2/12 flex justify-center">Level</p>
                                <p className="text-md mb-1 mt-1 w-5/12 flex justify-center">Asc. Req.</p>
                                <p className="text-md mb-1 mt-1 w-3/12 flex">Cost</p>
                                <p className="text-md mb-1 mt-1 w-9/12 flex">Materials</p>
                            </div>
                            {data.combat_info.talent_levening_mat.map((e: any, i: number) => <div key="hmm" className="bg-genshin-cardblue transition-all duration-300 w-full flex p-6 items-center rounded-md text-genshin-white overflow-hidden">
                                <p className="text-md mb-1 mt-1 w-2/12 flex font-rubik justify-center">{i+1} → {i+2}</p>
                                <p className="text-md mb-1 mt-1 w-5/12 flex font-rubik justify-center">{e.ascensions_req}✦</p>
                                <p className="text-md mb-1 mt-1 w-3/12 flex font-rubik">{e.cost}</p>
                                <div className="flex gap-2 w-9/12">
                                    {e.materials.map(({ rarity, image, amount }: {[key: string]: string}) => <div key="image" className="bg-no-repeat bg-cover rounded-md flex-shrink-0" style={{backgroundImage: `url(${require(`./assets/items/rarity/${rarity}.png`).default})`}}>
                                        <div className="flex flex-col items-center">
                                            <img src={image} style={{width: "4.4rem"}}/>
                                            <p className="mt-2 text-genshin-blue text-xs">{amount}</p>
                                        </div>
                                    </div>)}
                                    {Array(4 - e.materials.length).fill(0).map((_, i) => <div key={i} className="flex flex-col items-center" style={{width: "4.4rem"}}></div>)}
                                </div>
                            </div>)}
                        </div>
                    </div>
                </>
            </VisibilitySensor>
            <VisibilitySensor
                onChange={(isVisible) => {
                    if (isVisible && !first) {
                        setIsAuto(true);
                        changeSubSection(2);
                    }
                }}
            >
                <>
                    <div className="flex items-center gap-3 pt-12" id="1-2">
                        <Bullet color="#ACCACB"/>
                        <span className="text-genshin-detailsblue text-3xl">Constellation</span>
                    </div>
                    <div className="flex flex-col gap-4 mt-6 pl-1">
                        {data.combat_info.constellation.map(({level, icon, name, effect}: {[key: string]: string}) => 
                            <div key="name" className="bg-genshin-cardblue p-6 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <img src={icon} className="w-16 h-16"/>
                                    <div className="mt-1">
                                        <h3 className="text-genshin-white text-3xl">{name}</h3>
                                        <p className="text-genshin-detailsblue text-lg">Level {level}</p>
                                    </div>
                                </div>
                                <div><ReactMarkdown className="react-markdown">{effect}</ReactMarkdown></div>
                            </div>
                        )}
                    </div>
                </>
            </VisibilitySensor>
            <VisibilitySensor
                onChange={(isVisible) => {
                    if (isVisible && !first) {
                        setIsAuto(true);
                        changeSubSection(3);
                    }
                }}
            >
                <>
                    <div className="flex items-center gap-3 pt-12" id="1-3">
                        <Bullet color="#ACCACB"/>
                        <span className="text-genshin-detailsblue text-3xl">Ascensions</span>
                    </div>
                    <div className="flex flex-col gap-4 mt-6 pl-1">
                        <div className="w-full flex px-4 items-center text-genshin-lighterblue overflow-hidden">
                            <p className="text-md mb-1 mt-1 w-1/12 flex justify-center">Rank</p>
                            <p className="text-md mb-1 mt-1 w-3/12 flex justify-center pl-2">Level</p>
                            <p className="text-md mb-1 mt-1 w-3/12 flex pl-2">Cost</p>
                            <p className="text-md mb-1 mt-1 w-9/12 flex pl-16">Materials</p>
                        </div>
                        {data.combat_info.ascensions.map((e: any, i: number) => <div key="hmm" className="bg-genshin-cardblue transition-all duration-300 cursor-pointer w-full flex p-4 items-center rounded-md text-genshin-white overflow-hidden">
                            <p className="text-md mb-1 mt-1 w-1/12 flex justify-center ml-1">{i+1}</p>
                            <p className="text-md mb-1 mt-1 w-3/12 flex font-rubik justify-center ml-1">{ascLevel[i]}</p>
                            <p className="text-md mb-1 mt-1 w-3/12 flex font-rubik ml-1">{((i+1)*20000).toLocaleString("en-US")}</p>
                            <div className="flex gap-2 w-9/12 justify-end">
                                {i ? e.map(({ rarity, image, amount }: {[key: string]: string}) => <div key="image" className="bg-no-repeat bg-cover rounded-md flex-shrink-0" style={{backgroundImage: `url(${require(`./assets/items/rarity/${rarity}.png`).default})`}}>
                                    <div className="flex flex-col items-center">
                                        <img src={image} style={{width: "4.4rem"}}/>
                                        <p className="mt-2 text-genshin-blue text-xs">{amount}</p>
                                    </div>
                                </div>) : <>
                                    <div className="bg-no-repeat bg-cover rounded-md flex-shrink-0" style={{backgroundImage: `url(${require(`./assets/items/rarity/${e[0].rarity}.png`).default})`}}>
                                        <div className="flex flex-col items-center">
                                            <img src={e[0].image} style={{width: "4.4rem"}}/>
                                            <p className="mt-2 text-genshin-blue text-xs">{e[0].amount}</p>
                                        </div>
                                    </div>
                                    <div className="bg-no-repeat bg-cover rounded-md flex-shrink-0" style={{width: "4.4rem"}}>
                                    </div>
                                    <div className="bg-no-repeat bg-cover rounded-md flex-shrink-0" style={{backgroundImage: `url(${require(`./assets/items/rarity/${e[1].rarity}.png`).default})`}}>
                                        <div className="flex flex-col items-center">
                                            <img src={e[1].image} style={{width: "4.4rem"}}/>
                                            <p className="mt-2 text-genshin-blue text-xs">{e[1].amount}</p>
                                        </div>
                                    </div>
                                    <div className="bg-no-repeat bg-cover rounded-md flex-shrink-0" style={{backgroundImage: `url(${require(`./assets/items/rarity/${e[2].rarity}.png`).default})`}}>
                                        <div className="flex flex-col items-center">
                                            <img src={e[2].image} style={{width: "4.4rem"}}/>
                                            <p className="mt-2 text-genshin-blue text-xs">{e[2].amount}</p>
                                        </div>
                                    </div>
                                </>}
                            </div>
                        </div>)}
                    </div>
                </>
            </VisibilitySensor>
        </div>
    </div>;
};

const Availability: React.FC<IAvailability> = ({data, setIsAuto, changeSubSection, first}: IAvailability):JSX.Element => {
    return <div className="w-full ml-6 h-screen overflow-y-auto" style={{flexShrink: 9999}}>
        <CharBanner data={data}/>
        <div className="pb-12 pl-4 pr-12">
            <VisibilitySensor
                onChange={(isVisible) => {
                    if (isVisible && !first) {
                        setIsAuto(true);
                        changeSubSection(0);
                    }
                }}
            >
                <>
                    <div className="flex items-center gap-3 pt-12" id="2-0">
                        <Bullet color="#ACCACB"/>
                        <span className="text-genshin-detailsblue text-3xl">Availability</span>
                    </div>
                    <div className="flex flex-col gap-4 mt-6 pl-10">

                        {data.availability.availability ? <div><ReactMarkdown className="mt-0 react-markdown">{data.availability.availability}</ReactMarkdown></div> : ""}
                        <div className="flex items-center gap-3 pt-2">
                            <Bullet size={22} color="#ACCACB"/>
                            <span className="text-genshin-detailsblue text-2xl">Paimon’s Bargains</span>
                        </div>
                        <div className="text-genshin-white font-rubik text-lg tracking-wider -mt-2">{data.name} was {data.availability.paimon_bargain?.length ? "" : "not"} available in {data.availability.paimon_bargain?.length || ""} <strong className="font-rubik">Paimon’s Bargains</strong> Starglitter Exchange.</div>
                        {data.availability.paimon_bargain?.map(({date, item}: {date: string, item: {[key: string]: string}[]}) => <div key={date} className="bg-genshin-cardblue p-4 rounded-lg">
                            <h3 className="text-genshin-white text-xl">{date}</h3>
                            <div className="flex justify-center gap-2 mt-2">
                                {item.map(({ rarity, image, text }: {[key: string]: string}) => <div key="image" className="bg-no-repeat bg-cover rounded-md" style={{backgroundImage: `url(${require(`./assets/items/rarity/${rarity}.png`).default})`}}>
                                    <div className="flex flex-col items-end">
                                        <img src={image} className="w-22"/>
                                        <img className="h-3 -mt-3" src="https://static.wikia.nocookie.net/gensin-impact/images/7/79/Card_Corner.png"/>
                                        <p className="text-genshin-blue text-xs w-full text-center">{text}</p>
                                    </div>
                                </div>)}
                            </div>
                        </div>)}
                        <div className="flex items-center gap-3 pt-2">
                            <Bullet size={22} color="#ACCACB"/>
                            <span className="text-genshin-detailsblue text-2xl">Event Wishes</span>
                        </div>
                        <div className="text-genshin-white font-rubik text-lg tracking-wider -mt-2">{data.name} was {data.availability.event_wishes?.length ? "" : "not"} promoted or featured with a drop-rate boost in {data.availability.event_wishes?.length || "any"} <strong className="font-rubik">Event Wishes</strong>.</div>
                        {data.availability.event_wishes?.map(({image, name, item}: {image: string, name: string, item: {[key: string]: string}[]}) => <div key={name} className="bg-genshin-cardblue p-4 rounded-lg">
                            <h3 className="text-genshin-white text-xl">{name.replace("/", " / ")}</h3>
                            <div className="flex mt-2">
                                <div><img src={require("./assets/wishes/"+image).default} className="w-full h-full object-cover"/></div>
                                <div className="grid grid-cols-2 ml-2 justify-center gap-2">
                                    {item.map(({ rarity, image, text }: {[key: string]: string}) => <div key="image" className="bg-no-repeat bg-cover rounded-md" style={{backgroundImage: `url(${require(`./assets/items/rarity/${rarity}.png`).default})`}}>
                                        <div className="flex flex-col items-end">
                                            <img src={image} className="w-56"/>
                                            <img className="h-3 -mt-3" src="https://static.wikia.nocookie.net/gensin-impact/images/7/79/Card_Corner.png"/>
                                            <p className="text-genshin-blue text-xs w-full text-center">{text}</p>
                                        </div>
                                    </div>)}
                                </div>
                            </div>
                        </div>)}
                    </div>
                </>
            </VisibilitySensor>
        </div>
    </div>;
};

const Stories: React.FC<IStories> = ({data, setIsAuto, changeSubSection, first}: IStories):JSX.Element => {
    const getIcon = (indicator: "yes" | "no" | "spec") => {
        let icon: JSX.Element;
        switch (indicator){
        case "yes": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.7104 7.20986C18.6175 7.11613 18.5069 7.04174 18.385 6.99097C18.2632 6.9402 18.1324 6.91406 18.0004 6.91406C17.8684 6.91406 17.7377 6.9402 17.6159 6.99097C17.494 7.04174 17.3834 7.11613 17.2904 7.20986L9.84044 14.6699L6.71044 11.5299C6.61392 11.4366 6.49998 11.3633 6.37512 11.3141C6.25026 11.2649 6.11694 11.2408 5.98276 11.2431C5.84858 11.2454 5.71617 11.2741 5.59309 11.3276C5.47001 11.3811 5.35868 11.4583 5.26544 11.5549C5.1722 11.6514 5.09889 11.7653 5.04968 11.8902C5.00048 12.015 4.97635 12.1484 4.97867 12.2825C4.98099 12.4167 5.00972 12.5491 5.06321 12.6722C5.1167 12.7953 5.19392 12.9066 5.29044 12.9999L9.13044 16.8399C9.2234 16.9336 9.334 17.008 9.45586 17.0588C9.57772 17.1095 9.70843 17.1357 9.84044 17.1357C9.97245 17.1357 10.1032 17.1095 10.225 17.0588C10.3469 17.008 10.4575 16.9336 10.5504 16.8399L18.7104 8.67986C18.8119 8.58622 18.893 8.47257 18.9484 8.34607C19.0038 8.21957 19.0324 8.08296 19.0324 7.94486C19.0324 7.80676 19.0038 7.67015 18.9484 7.54365C18.893 7.41715 18.8119 7.3035 18.7104 7.20986Z" fill="#BBE922"/></svg>; break;
        case "no": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.4099 12.0002L17.7099 7.71019C17.8982 7.52188 18.004 7.26649 18.004 7.00019C18.004 6.73388 17.8982 6.47849 17.7099 6.29019C17.5216 6.10188 17.2662 5.99609 16.9999 5.99609C16.7336 5.99609 16.4782 6.10188 16.2899 6.29019L11.9999 10.5902L7.70994 6.29019C7.52164 6.10188 7.26624 5.99609 6.99994 5.99609C6.73364 5.99609 6.47824 6.10188 6.28994 6.29019C6.10164 6.47849 5.99585 6.73388 5.99585 7.00019C5.99585 7.26649 6.10164 7.52188 6.28994 7.71019L10.5899 12.0002L6.28994 16.2902C6.19621 16.3831 6.12182 16.4937 6.07105 16.6156C6.02028 16.7375 5.99414 16.8682 5.99414 17.0002C5.99414 17.1322 6.02028 17.2629 6.07105 17.3848C6.12182 17.5066 6.19621 17.6172 6.28994 17.7102C6.3829 17.8039 6.4935 17.8783 6.61536 17.9291C6.73722 17.9798 6.86793 18.006 6.99994 18.006C7.13195 18.006 7.26266 17.9798 7.38452 17.9291C7.50638 17.8783 7.61698 17.8039 7.70994 17.7102L11.9999 13.4102L16.2899 17.7102C16.3829 17.8039 16.4935 17.8783 16.6154 17.9291C16.7372 17.9798 16.8679 18.006 16.9999 18.006C17.132 18.006 17.2627 17.9798 17.3845 17.9291C17.5064 17.8783 17.617 17.8039 17.7099 17.7102C17.8037 17.6172 17.8781 17.5066 17.9288 17.3848C17.9796 17.2629 18.0057 17.1322 18.0057 17.0002C18.0057 16.8682 17.9796 16.7375 17.9288 16.6156C17.8781 16.4937 17.8037 16.3831 17.7099 16.2902L13.4099 12.0002Z" fill="#BB0909"/></svg>; break;
        case "spec": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.5616 14.634L13.9996 12L18.5616 9.366C18.7894 9.23245 18.9552 9.01421 19.0227 8.75892C19.0902 8.50362 19.0539 8.23199 18.9219 8.00331C18.7899 7.77462 18.5727 7.60744 18.3179 7.53825C18.063 7.46906 17.7912 7.50348 17.5616 7.634L12.9996 10.268V5C12.9996 4.73478 12.8943 4.48043 12.7067 4.29289C12.5192 4.10536 12.2648 4 11.9996 4C11.7344 4 11.48 4.10536 11.2925 4.29289C11.105 4.48043 10.9996 4.73478 10.9996 5V10.268L6.43762 7.634C6.20806 7.50348 5.9362 7.46906 5.68135 7.53825C5.42651 7.60744 5.20938 7.77462 5.07734 8.00331C4.94531 8.23199 4.90908 8.50362 4.97658 8.75892C5.04408 9.01421 5.20981 9.23245 5.43762 9.366L9.99962 12L5.43762 14.634C5.20981 14.7676 5.04408 14.9858 4.97658 15.2411C4.90908 15.4964 4.94531 15.768 5.07734 15.9967C5.20938 16.2254 5.42651 16.3926 5.68135 16.4617C5.9362 16.5309 6.20806 16.4965 6.43762 16.366L10.9996 13.732V19C10.9996 19.2652 11.105 19.5196 11.2925 19.7071C11.48 19.8946 11.7344 20 11.9996 20C12.2648 20 12.5192 19.8946 12.7067 19.7071C12.8943 19.5196 12.9996 19.2652 12.9996 19V13.732L17.5616 16.366C17.7912 16.4965 18.063 16.5309 18.3179 16.4617C18.5727 16.3926 18.7899 16.2254 18.9219 15.9967C19.0539 15.768 19.0902 15.4964 19.0227 15.2411C18.9552 14.9858 18.7894 14.7676 18.5616 14.634Z" fill="#F0F3E5"/></svg>; break;                          
        }
        return icon;
    };

    return <div className="w-full ml-6 h-screen overflow-y-auto" style={{flexShrink: 9999}}>
        <CharBanner data={data}/>
        <div className="pb-12 pl-4 pr-12">
            <VisibilitySensor
                onChange={(isVisible) => {
                    if (isVisible && !first) {
                        setIsAuto(true);
                        changeSubSection(0);
                    }
                }}
            >
                <>
                    <div className="flex items-center gap-3 pt-12" id="3-0">
                        <Bullet color="#ACCACB"/>
                        <span className="text-genshin-detailsblue text-3xl">Character Stories</span>
                    </div>
                    <div className="flex flex-col gap-4 mt-6 pl-10">
                        {Object.entries<string[]>(data.stories.stories).map(([title, content]: [string, string[]]) => <div key={title}>
                            <div className="flex items-center gap-3 pt-2">
                                <Bullet size={22} color="#ACCACB"/>
                                <span className="text-genshin-detailsblue text-2xl">{title}</span>
                            </div>
                            {content.map((e: string) => <div key={e}><ReactMarkdown className="react-markdown">{e}</ReactMarkdown></div>)}
                        </div>)}
                    </div>
                </>
            </VisibilitySensor>
            {data.stories.namecard ? <VisibilitySensor
                onChange={(isVisible) => {
                    if (isVisible && !first) {
                        setIsAuto(true);
                        changeSubSection(1);
                    }
                }}
            >
                <>
                    <div className="flex items-center gap-3 pt-12" id="3-1">
                        <Bullet color="#ACCACB"/>
                        <span className="text-genshin-detailsblue text-3xl">Namecard</span>
                    </div>
                    <div className="flex flex-col gap-4 mt-6 pl-10">
                        <div className="bg-genshin-cardblue p-6 rounded-lg">
                            <h3 className="text-genshin-white text-2xl">{data.stories.namecard.name}</h3>
                            <div className="flex items-center mt-2">
                                <img src={data.stories.namecard.image} className="w-6/12 mr-2 -ml-4 -mt-12 -mb-12"/>
                                <div className="w-6/12">
                                    <h4 className="text-genshin-detailsblue font-rubik font-bold tracking-wider text-xl mb-1">Obtain</h4>
                                    <p className="text-genshin-white font-rubik tracking-wider text-md leading-tight">{data.stories.namecard.obtain}</p>
                                    <h4 className="text-genshin-detailsblue font-rubik font-bold tracking-wider text-xl mt-4 mb-1">Description</h4>
                                    <p className="text-genshin-white font-rubik tracking-wider text-md leading-tight">{data.stories.namecard.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            </VisibilitySensor> : ""}
            <VisibilitySensor
                onChange={(isVisible) => {
                    if (isVisible && !first) {
                        setIsAuto(true);
                        changeSubSection(2);
                    }
                }}
            >
                <>
                    <div className="flex items-center gap-3 pt-12" id="3-2">
                        <Bullet color="#ACCACB"/>
                        <span className="text-genshin-detailsblue text-3xl">Constellation</span>
                    </div>
                    <div className="flex flex-col gap-4 mt-6 pl-10">
                        <h3 className="text-genshin-white text-2xl relative z-30 ml-7 mt-5">{data.stories.constellation.image.split(".")[0].replace(/_/g, " ")}</h3>
                        <p className="text-genshin-white font-rubik text-md relative z-30 tracking-wide ml-7 -mt-4"><span className="font-rubik font-medium">Meaning:</span> {data.stories.constellation.meaning}</p>
                        <img src={require("./assets/characters/constellation/"+data.stories.constellation.image).default} className="relative rounded-lg -mt-24"/>
                    </div>
                </>
            </VisibilitySensor>
            <VisibilitySensor
                onChange={(isVisible) => {
                    if (isVisible && !first) {
                        setIsAuto(true);
                        changeSubSection(3);
                    }
                }}
            >
                <>
                    <div className="flex items-center gap-3 pt-12" id="3-3">
                        <Bullet color="#ACCACB"/>
                        <span className="text-genshin-detailsblue text-3xl">Quests & Events</span>
                    </div>
                    <div className="flex flex-col gap-4 mt-6 pl-10">
                        {Object.entries<string>(data.stories.quests_events).map(([k, v]: string[]) => <div key={k}>
                            <div className="flex items-center gap-3">
                                <Bullet size={22} color="#ACCACB"/>
                                <span className="text-genshin-detailsblue text-2xl">{k}</span>
                            </div>
                            <div><ReactMarkdown className="react-markdown ml-9">{v}</ReactMarkdown></div>
                        </div>)}
                    </div>
                </>
            </VisibilitySensor>
            <VisibilitySensor
                onChange={(isVisible) => {
                    if (isVisible && !first) {
                        setIsAuto(true);
                        changeSubSection(4);
                    }
                }}
            >
                <>
                    <div className="flex items-center gap-3 pt-12" id="3-4">
                        <Bullet color="#ACCACB"/>
                        <span className="text-genshin-detailsblue text-3xl">Character Interactions</span>
                    </div>
                    <div className="flex flex-col gap-4 mt-6 pl-10">
                        <div className="text-genshin-white font-rubik text-lg tracking-wider -mt-2">The following characters mention {data.name} in their <strong className="font-rubik">character stories</strong> or <strong className="font-rubik">voice lines</strong>.</div>
                        <div className="flex flex-col gap-2 mt-2 pl-1">
                            <div className="w-full flex px-4 items-center text-genshin-lighterblue overflow-hidden">
                                <p className="text-md mb-1 mt-1 w-8/12">Character</p>
                                <p className="text-md mb-1 mt-1 w-4/12 flex justify-center">Stories</p>
                                <p className="text-md mb-1 mt-1 w-4/12 flex justify-center">Voice Lines</p>
                            </div>
                            {Object.entries<{stories: "yes" | "no" | "spec", voices: "yes" | "no" | "spec",}>(data.stories.interactions).map(([name, {stories, voices}]: [string, {stories: "yes" | "no" | "spec", voices: "yes" | "no" | "spec",}]) => <div key="hmm" className="bg-genshin-cardblue transition-all duration-300 w-full flex p-4 items-center rounded-md text-genshin-white overflow-hidden">
                                <div className="flex items-center w-8/12">
                                    <img className="w-8" src={require(`./assets/characters/icon/${name.toLowerCase().replace(/\s/g, "_")}.png`).default}/>
                                    <p className="text-xl ml-4 pt-0.5">{name}</p>
                                </div>
                                <div className="w-4/12 flex justify-center">{getIcon(stories)}</div>
                                <div className="w-4/12 flex justify-center">{getIcon(voices)}</div>
                            </div>)}
                        </div>
                    </div>
                </>
            </VisibilitySensor>
        </div>
    </div>;
};

const CharacterInfo: React.FC<ICharInfo> = ({selectedChar, setSelectedChar}: ICharInfo): JSX.Element => {
    const tabs = {
        "Profile": [
            "Images",
            "Bio",
            "Voice Actors",
            "Introduction",
            "Personality",
            "Appearance"
        ],
        "Combat Info": [
            "Basic Stats",
            "Talents",
            "Constellation",
            "Ascentions"
        ],
        "Availability": [],
        "Stories": [
            "Character Stories",
            "Namecards",
            "Constellation",
            "Quest & Events",
            "Character Interactions"
        ],
        "Voice-Overs": [
            "Japanese",
            "English",
            "Chinese",
            "Korean",
        ],
        "Outfits": [],
        "Media": [
            "Videos",
            "Animations",
            "Artworks",
            "Event Artworks",
            "Comics",
            "Screenshots",
            "In Game Assets"
        ]
    };

    const [currentSection, changeSection] = useState(0);
    const [currentSubSection, changeSubSection] = useState(0);
    const [isAuto, setIsAuto] = useState(false);

    const data = require(`./data/character/details/${selectedChar.replace(/\s/g, "_")}.json`);
    const [first, setFirst] = useState(true);
    const [second, setSecond] = useState(false);

    useEffect(() => {
        if ((!first && !isAuto) || second) {
            document.getElementById(`${currentSection}-${currentSubSection}`)?.scrollIntoView({behavior: "smooth", block: "start"});
        }
        setSecond(false);
        setFirst(false);
        setIsAuto(false);
    }, [currentSubSection]);

    return <div className="section w-full flex char">
        <Scrollbar className="flex flex-col h-screen overflow-y-auto py-12 gap-7 pr-8 flex-grow">
            {Object.entries(tabs).map(([k, v], i) => <div key={k}>
                <a className={"text-genshin-white flex gap-3 items-center cursor-pointer transition-all " + (currentSection === i ? "text-3xl" : "text-2xl opacity-60")} onClick={() => {setIsAuto(false); changeSubSection(0); changeSection(i);}}>
                    <svg className="transition-all flex-shrink-0" width={currentSection === i ? "27" : "17"} height={currentSection === i ? "27" : "17"} viewBox="0 0 27 27" fill={currentSection === i ? "none" : "#F8FEE4"} xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.707107" y="13.3553" width="17.8873" height="17.8873" transform="rotate(-45 0.707107 13.3553)" stroke="#F8FEE4"/>
                        <path d="M23.3554 13.3553L13.3553 3.35531V23.3554L23.3554 13.3553Z" fill="#F8FEE4"/>
                        <path className={"transition-all " + (currentSection === i ? "opacity-0" : "opacity-100")} d="M3.35528 13.3553L13.3553 23.3554V3.35531L3.35528 13.3553Z" fill="#F8FEE4"/>
                    </svg>
                    <span className="whitespace-nowrap">{k}</span>
                </a>
                <div className={"ml-8 flex flex-col gap-4 " + (v.length ? "mt-4" : "")}>
                    {v.map((e, i2) => <div key={e}>
                        <a className={"text-genshin-white flex gap-3 items-center cursor-pointer transition-all " + ((currentSubSection === i2 && currentSection === i) ? "text-2xl" : "text-xl opacity-60")} onClick={() => {setIsAuto(false); (currentSection !== i ? (() => {setFirst(true); setSecond(true);})() : ""); changeSection(i); changeSubSection(i2);}}>
                            <svg className="transition-all flex-shrink-0" width={(currentSubSection === i2 && currentSection === i) ? "20" : "14"} height={(currentSubSection === i2 && currentSection === i) ? "27" : "17"} viewBox="0 0 27 27" fill={(currentSubSection === i2 && currentSection === i) ? "none" : "#F8FEE4"} xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.707107" y="13.3553" width="17.8873" height="17.8873" transform="rotate(-45 0.707107 13.3553)" stroke="#F8FEE4"/>
                                <path d="M23.3554 13.3553L13.3553 3.35531V23.3554L23.3554 13.3553Z" fill="#F8FEE4"/>
                                <path className={"transition-all " + ((currentSubSection === i2 && currentSection === i) ? "opacity-0" : "opacity-100")} d="M3.35528 13.3553L13.3553 23.3554V3.35531L3.35528 13.3553Z" fill="#F8FEE4"/>
                            </svg>
                            <span className="whitespace-nowrap">{e}</span>
                        </a>
                        <div></div>
                    </div>)}
                </div>
            </div>)}
        </Scrollbar>
        {currentSection === 0 ? <Profile data={data} setIsAuto={setIsAuto} changeSubSection={changeSubSection} first={first}/> : ""}
        {currentSection === 1 ? <CombatInfo data={data} setIsAuto={setIsAuto} changeSubSection={changeSubSection} first={first}/> : ""}
        {currentSection === 2 ? <Availability data={data} setIsAuto={setIsAuto} changeSubSection={changeSubSection} first={first}/> : ""}
        {currentSection === 3 ? <Stories data={data} setIsAuto={setIsAuto} changeSubSection={changeSubSection} first={first}/> : ""}
    </div>;
};

interface ICharacter {
    currentTab: number;
    changeTab: any;
}

const Character: React.FC<ICharacter> = ({currentTab, changeTab}: ICharacter): JSX.Element => {
    const [selectedChar, setSelectedChar] = useState<string|undefined>(undefined);
    
    return <>
        <Navbar currentTab={currentTab} changeTab={changeTab} setSelectedChar={setSelectedChar}/>
        {!selectedChar ? <CharacterIndex setSelectedChar={setSelectedChar}/> : <CharacterInfo selectedChar={selectedChar || ""} setSelectedChar={setSelectedChar}/>}
    </>;
};

export default Character;