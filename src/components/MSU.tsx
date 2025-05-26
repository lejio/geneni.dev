import React from "react";
import msu_icon from "../images/msu_helmet.svg";
import MSU_1 from "../images/MSU_1.jpg";
import MSU_2 from "../images/MSU_2.jpg";
import MSU_3 from "../images/MSU_3.jpg";
import MSU_4 from "../images/MSU_4.jpg";

import I_CPP from "../images/I_CPP";
import I_Astro from "../images/I_Astro";
import I_TS from "../images/I_TS";

export default function MSU() {
  const techStack = [I_CPP, I_Astro, I_TS];

  return (
    <div className="w-full h-full flex flex-col justify-start align-middle items-center gap-5">
      <div className="flex text-[#18453B] flex-col justify-center items-center align-middle">
        <img className="w-10 md:w-20" src={msu_icon.src} alt="MSU Logo" />
        <div className="flex flex-col justify-center items-center align-middle">
          <h2 className="text-base md:text-xl">Michigan State University</h2>
          <p className="text-sm">Irrigation Laboratory</p>
        </div>
      </div>

      <div className=" text-white flex flex-col gap-5 w-[500px] h-full">
        <div className=" w-[600px] flex flex-row gap-5">
          <img
            className=" rounded-xl"
            width={200}
            src={MSU_4.src}
            alt="Pic at MSU"
          />
          <div className="w-full flex flex-col gap-2">
            <h2 className="text-xl">Full Stack Developer</h2>
            <div className="flex flex-row gap-2">
              {techStack.map((Icon, idx) => {
                return (
                  <div key={idx} className="w-10 h-10">
                    <Icon />
                  </div>
                );
              })}
            </div>
            <p>
                Deserunt occaecat in sint amet nostrud sit tempor consectetur quis. Consequat anim est adipisicing mollit. Officia irure ea incididunt nulla irure qui laboris minim irure. Veniam commodo nisi ea irure est cillum eiusmod.
            </p>
          </div>
        </div>
        <img
          className="w-64 rounded-xl"
          width={200}
          src={MSU_1.src}
          alt="LOCOMOS Sensor"
        />
      </div>
    </div>
  );
}
