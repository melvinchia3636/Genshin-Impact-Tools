/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect } from "react";
import { useState } from "react";
import * as Elements from "./assets/elements";
import * as Weapons from "./assets/weapons";
import CharacterData from "./data/character/data.json";
import * as CharacterImages from "./assets/characters/icon";
import Scrollbar from "react-smooth-scrollbar";
import Navbar from "./navbar";

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
}

interface IProfile {
    data: any
}

interface ICombatInfo {
    data: any
}

const Bullet:React.FC<IBullet> = ({color}: IBullet): JSX.Element => {
    return <svg className="transition-all" width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.707107" y="13.3553" width="17.8873" height="17.8873" transform="rotate(-45 0.707107 13.3553)" stroke={color}/>
        <path d="M23.3554 13.3553L13.3553 3.35531V23.3554L23.3554 13.3553Z" fill={color}/>
    </svg>;
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
                    <p className="text-md mb-1 mt-1 w-4/12">Character Name</p>
                    <p className="text-md mb-1 mt-1 w-2/12">Rarity</p>
                    <p className="text-md mb-1 mt-1 w-3/12 flex">Weapon</p>
                    <p className="text-md mb-1 mt-1 w-3/12 flex">Gender</p>
                    <p className="text-md mb-1 mt-1 w-3/12 flex">Birthday</p>
                </div>
                {CharacterData.filter(e => e.vision === Object.entries(elements)[currentSection][0].toLocaleLowerCase()).map(({ name, weapon, rarity, gender, birthday }) => 
                    <div key={name} className="bg-genshin-reallylightblue bg-opacity-30 transition-all duration-300 cursor-pointer item w-full flex p-2 pr-6 items-center rounded-md text-genshin-white overflow-hidden" onClick={() => setSelectedChar(name)}>
                        <div className="flex items-center w-4/12">
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

const Profile: React.FC<IProfile> = ({data}: IProfile):JSX.Element => {
    let banner: string;
    try {banner = require(`./assets/characters/banner/${data.name.replace(/\s/g, "_")}.png`).default;}
    catch {banner = "";}
    const images =  ["card", "portrait", "ingame"].map(e => require(`./assets/characters/${e}/${data.name.replace(/\s/g, "_")}.png`).default);
    const icon = require(`./assets/characters/icon/${data.name.replace(/\s/g, "_").toLowerCase()}.png`).default;
    const Element = elements[data.profile.bio.element];
    const [imageType, setImageType] = useState(0);
    
    return <div className="w-full ml-6 h-screen overflow-y-auto" style={{flexShrink: 9999}}>
        <div style={banner ? {backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${banner})`} : {}} className="w-full bg-no-repeat bg-cover bg-bottom rounded-bl-xl flex items-center justify-between">
            <div className="flex items-center">
                <img src={icon} className="p-8"/>
                <div>
                    <h1 className="text-genshin-white text-5xl mt-1 whitespace-nowrap">{data.name}</h1>
                    <p className="text-genshin-white text-xl mt-2 tracking-wider">{data.nickname}</p>
                </div>
            </div>
            <p className="p-8 text-genshin-white text-3xl">{data.profile.bio.rarity} ✦</p>
        </div>
        <div className="pb-12 pl-4 pr-12">
            <div className="flex gap-24 items-center h-16 pt-8" id="0-0">
                <div className={"tracking-wider transition-all cursor-pointer "+(imageType === 0 ? "text-genshin-white text-3xl" : "text-genshin-detailsblue")} style={imageType !== 0 ? {fontSize: "1.4rem"} : {}} onClick={() => setImageType(0)}>Card</div>
                <div className={"tracking-wider transition-all cursor-pointer "+(imageType === 1 ? "text-genshin-white text-3xl" : "text-genshin-detailsblue")} style={imageType !== 1 ? {fontSize: "1.4rem"} : {}} onClick={() => setImageType(1)}>Portrait</div>
                <div className={"tracking-wider transition-all cursor-pointer "+(imageType === 2 ? "text-genshin-white text-3xl" : "text-genshin-detailsblue")} style={imageType !== 2 ? {fontSize: "1.4rem"} : {}} onClick={() => setImageType(2)}>In Game</div>
            </div>
            <img src={images[imageType]} className="w-full mt-8 rounded-xl"/>
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
            {
            //<div className="flex flex-col gap-6 mt-8 pl-1">
                //{data.profile.introduction.content.map((e:string) => <div key={e} className="text-genshin-white font-rubik text-lg tracking-wider ">{e}</div>)}
            //</div>
            }
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
            <div className="flex items-center gap-3 pt-16" id="0-5">
                <Bullet color="#ACCACB"/>
                <span className="text-genshin-detailsblue text-3xl">Appearance</span>
            </div>
            <div className="flex flex-col gap-6 mt-8 pl-1">
                {data.profile.appearance.map((e:string) => <div key={e} className="text-genshin-white font-rubik text-lg tracking-wider ">{e}</div>)}
            </div>
        </div>
    </div>;
};

const CombatInfo: React.FC<ICombatInfo> = ({data}: ICombatInfo):JSX.Element => {
    const banner = require(`./assets/characters/banner/${data.name.replace(/\s/g, "_")}.png`).default;
    const icon = require("./assets/characters/icon").ayaka;
    
    return <div className="w-full ml-6 h-screen overflow-y-auto" style={{flexShrink: 9999}}>
        <div style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${banner})`}} className="w-full bg-no-repeat bg-cover bg-bottom rounded-bl-xl flex items-center justify-between">
            <div className="flex items-center">
                <img src={icon} className="p-8"/>
                <div>
                    <h1 className="text-genshin-white text-5xl mt-1 whitespace-nowrap">{data.name}</h1>
                    <p className="text-genshin-white text-xl mt-2 tracking-wider">{data.nickname}</p>
                </div>
            </div>
            <p className="p-8 text-genshin-white text-3xl">{data.profile.bio.rarity} ✦</p>
        </div>
        <div className="pb-12 pl-4 pr-12">
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

    const data = require(`./data/character/details/${selectedChar.replace(/\s/g, "_")}.json`);
    const [first, setFirst] = useState(true);

    useEffect(() => {
        if (!first) {
            document.getElementById(`${currentSection}-${currentSubSection}`)?.scrollIntoView({behavior: "smooth"});
        } else setFirst(false);
    }, [currentSubSection]);

    return <div className="section w-full flex char">
        <Scrollbar className="flex flex-col h-screen overflow-y-auto py-12 gap-7 pr-8 flex-grow">
            {Object.entries(tabs).map(([k, v], i) => <div key={k}>
                <a className={"text-genshin-white flex gap-3 items-center cursor-pointer transition-all " + (currentSection === i ? "text-3xl" : "text-2xl opacity-60")} onClick={() => {changeSubSection(0); changeSection(i);}}>
                    <svg className="transition-all flex-shrink-0" width={currentSection === i ? "27" : "17"} height={currentSection === i ? "27" : "17"} viewBox="0 0 27 27" fill={currentSection === i ? "none" : "#F8FEE4"} xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.707107" y="13.3553" width="17.8873" height="17.8873" transform="rotate(-45 0.707107 13.3553)" stroke="#F8FEE4"/>
                        <path d="M23.3554 13.3553L13.3553 3.35531V23.3554L23.3554 13.3553Z" fill="#F8FEE4"/>
                        <path className={"transition-all " + (currentSection === i ? "opacity-0" : "opacity-100")} d="M3.35528 13.3553L13.3553 23.3554V3.35531L3.35528 13.3553Z" fill="#F8FEE4"/>
                    </svg>
                    <span className="whitespace-nowrap">{k}</span>
                </a>
                <div className={"ml-8 flex flex-col gap-4 " + (v.length ? "mt-4" : "")}>
                    {v.map((e, i2) => <div key={e}>
                        <a className={"text-genshin-white flex gap-3 items-center cursor-pointer transition-all " + ((currentSubSection === i2 && currentSection === i) ? "text-2xl" : "text-xl opacity-60")} onClick={() => {changeSubSection(i2); changeSection(i);}}>
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
        {currentSection === 0 ? <Profile data={data}/> : ""}
        {currentSection === 1 ? <CombatInfo data={data}/> : ""}
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