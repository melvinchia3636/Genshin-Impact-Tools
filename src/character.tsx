import React, { useEffect } from "react";
import { useState } from "react";
import * as Elements from "./assets/elements";
import * as Weapons from "./assets/weapons";
import CharacterData from "./data/character/data.json";
import * as CharacterImages from "./assets/characters";

const Character = ():JSX.Element => {
    const elements = Object.entries(Elements);
    const weapons = Object.fromEntries(Object.entries(Weapons));
    const images = Object.fromEntries(Object.entries(CharacterImages));
    
    const [currentTab, changeTab] = useState<number>(0);
    console.log(elements[currentTab][0].toLocaleLowerCase());
    return <div className="section w-full h-screen flex">
        <div className="items-center justify-between py-16 flex flex-col border-l-2 border-r-2 border-genshin-white h-full w-24" style={{background: "linear-gradient(180deg, rgba(146, 181, 201, 0.8) 28.55%, rgba(146, 181, 201, 0.24) 100%)"}}>
            {elements.map(([name, Com], i) => <button key={name} onClick={() => changeTab(i)}><Com {...(currentTab === i ? {} : {color: "white"})} size={42}/></button>)}
        </div>
        <div className="w-full pt-10 px-12">
            {(() => {
                const [name, Element] = elements[currentTab];
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
                {CharacterData.filter(e => e.vision === elements[currentTab][0].toLocaleLowerCase()).map(({ name, weapon, rarity, gender, birthday }) => 
                    <div key={name} className="bg-genshin-reallylightblue bg-opacity-30 transition-all duration-300 cursor-pointer  item w-full flex p-2 pr-6 items-center rounded-md text-genshin-white overflow-hidden">
                        <div className="flex items-center w-4/12">
                            <div className="rounded-sm rounded-br-2xl p-2 shadow-md" style={{background: (rarity === 4 ? "#966DB1" : "#d08434")}}><img className="w-10 h-10" src={images[name.toLowerCase().replace(/-/g, "_")]}/></div>
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
        </div>
    </div>;
};

export default Character;