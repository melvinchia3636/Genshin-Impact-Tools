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
                    <img src={images[imageType]} className="w-full mt-8 rounded-xl"/>
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
                        <div className="flex flex-col gap-2">
                            <p className="text-genshin-detailsblue text-xl tracking-wider">{data.combat_info.base_stats.special}</p>
                            <p className="text-genshin-white text-4xl tracking-wide" style={{fontSize: "2.4rem"}}>{baseStats[1][3]}</p>
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
                            <div key="name" className="bg-genshin-cardblue p-6 rounded-xl">
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
                        <div className="bg-genshin-cardblue p-6 rounded-xl">
                            <h3 className="text-genshin-white text-2xl">Talent Level-Up Materials</h3>
                            <div className="flex justify-center gap-4 mt-5">
                                {data.combat_info.lvup_mat[0].map(({ rarity, image, amount }: {[key: string]: string}) => <div key="image" className="bg-no-repeat bg-cover rounded-md" style={{backgroundImage: `url(${require(`./assets/items/rarity/${rarity}.png`).default})`}}>
                                    <div className="flex flex-col items-center">
                                        <img src={image} className="w-28"/>
                                        <p className="mt-2 text-genshin-blue">{amount}</p>
                                    </div>
                                </div>)}
                            </div>
                        </div>
                        <div className="bg-genshin-cardblue p-6 rounded-xl">
                            <h3 className="text-genshin-white text-2xl">Common Ascension Materials</h3>
                            <div className="flex justify-center gap-4 mt-5">
                                {data.combat_info.lvup_mat[1].map(({ rarity, image, amount }: {[key: string]: string}) => <div key="image" className="bg-no-repeat bg-cover rounded-md" style={{backgroundImage: `url(${require(`./assets/items/rarity/${rarity}.png`).default})`}}>
                                    <div className="flex flex-col items-center">
                                        <img src={image} className="w-28"/>
                                        <p className="mt-2 text-genshin-blue">{amount}</p>
                                    </div>
                                </div>)}
                            </div>
                        </div>
                        <div className="bg-genshin-cardblue p-6 rounded-xl">
                            <h3 className="text-genshin-white text-2xl">Weekly Boss Materials</h3>
                            <div className="flex justify-center gap-4 mt-5">
                                {data.combat_info.lvup_mat[2].map(({ rarity, image, amount }: {[key: string]: string}) => <div key="image" className="bg-no-repeat bg-cover rounded-md" style={{backgroundImage: `url(${require(`./assets/items/rarity/${rarity}.png`).default})`}}>
                                    <div className="flex flex-col items-center">
                                        <img src={image} className="w-28"/>
                                        <p className="mt-2 text-genshin-blue">{amount}</p>
                                    </div>
                                </div>)}
                            </div>
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
                            <div key="name" className="bg-genshin-cardblue p-6 rounded-xl">
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
                        <div className="w-full flex px-6 items-center text-genshin-lighterblue overflow-hidden">
                            <p className="text-md mb-1 mt-1 w-1/12 flex justify-center">Rank</p>
                            <p className="text-md mb-1 mt-1 w-3/12 flex justify-center">Level</p>
                            <p className="text-md mb-1 mt-1 w-3/12 flex">Cost</p>
                            <p className="text-md mb-1 mt-1 w-9/12 flex -ml-6">Materials</p>
                        </div>
                        {data.combat_info.ascensions.map((e: any, i: number) => <div key="hmm" className="bg-genshin-cardblue transition-all duration-300 cursor-pointer w-full flex p-6 items-center rounded-md text-genshin-white overflow-hidden">
                            <p className="text-md mb-1 mt-1 w-1/12 flex justify-center ml-1">{i+1}</p>
                            <p className="text-md mb-1 mt-1 w-3/12 flex font-rubik justify-center ml-1">{ascLevel[i]}</p>
                            <p className="text-md mb-1 mt-1 w-3/12 flex font-rubik ml-1">{((i+1)*20000).toLocaleString("en-US")}</p>
                            <div className="flex gap-4 w-9/12 justify-end">
                                {i ? e.map(({ rarity, image, amount }: {[key: string]: string}) => <div key="image" className="bg-no-repeat bg-cover rounded-md flex-shrink-0" style={{backgroundImage: `url(${require(`./assets/items/rarity/${rarity}.png`).default})`}}>
                                    <div className="flex flex-col items-center">
                                        <img src={image} className="w-20"/>
                                        <p className="mt-2 text-genshin-blue text-sm">{amount}</p>
                                    </div>
                                </div>) : <>
                                    <div className="bg-no-repeat bg-cover rounded-md flex-shrink-0" style={{backgroundImage: `url(${require(`./assets/items/rarity/${e[0].rarity}.png`).default})`}}>
                                        <div className="flex flex-col items-center">
                                            <img src={e[0].image} className="w-20"/>
                                            <p className="mt-2 text-genshin-blue text-sm">{e[0].amount}</p>
                                        </div>
                                    </div>
                                    <div className="bg-no-repeat bg-cover rounded-md flex-shrink-0 w-20">
                                    </div>
                                    <div className="bg-no-repeat bg-cover rounded-md flex-shrink-0" style={{backgroundImage: `url(${require(`./assets/items/rarity/${e[1].rarity}.png`).default})`}}>
                                        <div className="flex flex-col items-center">
                                            <img src={e[1].image} className="w-20"/>
                                            <p className="mt-2 text-genshin-blue text-sm">{e[1].amount}</p>
                                        </div>
                                    </div>
                                    <div className="bg-no-repeat bg-cover rounded-md flex-shrink-0" style={{backgroundImage: `url(${require(`./assets/items/rarity/${e[2].rarity}.png`).default})`}}>
                                        <div className="flex flex-col items-center">
                                            <img src={e[2].image} className="w-20"/>
                                            <p className="mt-2 text-genshin-blue text-sm">{e[2].amount}</p>
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
                        <div className="flex items-center gap-3 pt-4">
                            <span className="text-genshin-detailsblue text-2xl">Paimon’s Bargains</span>
                        </div>
                        <div className="text-genshin-white font-rubik text-lg tracking-wider -mt-2">{data.name} was {data.availability.paimon_bargain?.length ? "" : "not"} available in {data.availability.paimon_bargain?.length || ""} <strong className="font-rubik">Paimon’s Bargains</strong> Starglitter Exchange.</div>
                        {data.availability.paimon_bargain?.map(({date, item}: {date: string, item: {[key: string]: string}[]}) => <div key={date} className="bg-genshin-cardblue p-4 rounded-xl">
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
                        <div className="flex items-center gap-3 pt-4">
                            <span className="text-genshin-detailsblue text-2xl">Event Wishes</span>
                        </div>
                        <div className="text-genshin-white font-rubik text-lg tracking-wider -mt-2">{data.name} was {data.availability.event_wishes?.length ? "" : "not"} promoted or featured with a drop-rate boost in {data.availability.event_wishes?.length || "any"} <strong className="font-rubik">Event Wishes</strong>.</div>
                        {data.availability.event_wishes?.map(({image, name, item}: {image: string, name: string, item: {[key: string]: string}[]}) => <div key={name} className="bg-genshin-cardblue p-4 rounded-xl">
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
            "Character Interactions",
            "Mail"
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