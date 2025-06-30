import { useEffect } from "react";

import { animate, stagger } from "framer-motion";
// import MSU_Helmet from "../images/msu_helmet.svg";
// import MSU_Seal from "../images/msu_seal.svg";

import I_C from "../images/I_C";
import I_CPP from "../images/I_CPP";
import JHUAPL from "./JHUAPL";
import I_Dart from "../images/I_Dart";
import I_Flutter from "../images/I_Flutter";
import I_Firebase from "../images/I_Firebase";
import I_TS from "../images/I_TS";
import I_React from "../images/I_React";
// import MSU from "./MSU";

export default function Experience() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".stagger"));
    const elements2 = Array.from(document.querySelectorAll(".stagger-2"));
    const elements3 = Array.from(document.querySelectorAll(".stagger-3"));
    const controls2 = animate(
      elements2,
      { opacity: [0, 1], y: [20, 0] },
      {
        delay: stagger(0.1, { startDelay: 0.2 }),
        duration: 0.4,
        ease: "easeOut",
      }
    );
    const controls3 = animate(
      elements3,
      { opacity: [0, 1], y: [20, 0] },
      {
        delay: stagger(0.1, { startDelay: 0.2 }),
        duration: 0.4,
        ease: "easeOut",
      }
    );
    const controls = animate(
      elements,
      { opacity: [0, 1], y: [20, 0] },
      {
        delay: stagger(0.1, { startDelay: 0.2 }),
        duration: 0.4,
        ease: "easeOut",
      }
    );
    return () => {
      controls.stop();
      controls2.stop();
      controls3.stop();
    };
  }, []);
  // #052f73
  return (
    <div className="relative max-w-[1920px] md:max-h-[1080px] w-full h-auto md:h-[85vh] flex flex-col gap-5 rounded-xl items-center align-middle">
      <div className="absolute inset-0 p-10">
        <img
          src="/msu_helmet.svg"
          alt="Background Logo"
          className="w-full h-full object-contain opacity-[0.05] z-0 pointer-events-none"
        />
      </div>

      <div className="relative z-10 p-5 w-full h-full flex flex-col justify-evenly items-center align-middle">
        <div className="flex flex-col justify-center items-center align-middle p-10 pt-0 gap-2">
          <img
            src="/msu_seal.svg"
            alt="MSU Seal"
            className="stagger w-16 h-16 md:w-32 md:h-32"
          />
          <h1 className="stagger text-base md:text-xl text-[#18453B] font-bold">
            Michigan State University
          </h1>
          <p className="stagger text-sm md:text-base text-[#18453B]">
            Irrigation Laboratory
          </p>
        </div>

        <div className="flex w-full h-full pt-5 flex-row gap-10">
          <div className="flex flex-col w-full h-full justify-start items-center align-middle gap-5">
            <div className="flex flex-row justify-center gap-5 w-full">
              <img
                src="/MSU_1.jpg"
                alt="LOCOMOS Sensor"
                className="stagger h-52 rounded"
              />
              <div className="flex flex-col gap-4">
                <h2 className="stagger text-md md:text-lg text-[#18453B] font-bold">
                  Low-Cost Monitoring System (LOCOMOS)
                </h2>
                <hr className="stagger" />
                <div className="flex flex-row justify-start gap-4">
                  <div className="stagger h-12 w-12">
                    <I_C />
                  </div>
                  <div className="stagger h-12 w-12">
                    <I_CPP />
                  </div>
                </div>
                <p className="stagger text-xs md:text-sm text-[#18453B] text-wrap">
                  Programmed the LOCOMOS line of sensors that are being used
                  across Michigan and Washington State
                </p>
              </div>
            </div>
            <p className="stagger text-xs md:text-sm text-[#18453B] text-wrap">
              Improved battery life by 100% with ULP mode and local caching,
              allowing sensors to survive the winter during low sunlight seasons
            </p>
            <ul className="text-xs md:text-sm text-[#18453B] list-disc pl-5">
              <li className="stagger">
                <p>
                  Reduced the number of publish requests from all particle
                  devices by 4x. Utilized onboard memory to cache data and
                  reduce the frequency of network requests
                </p>
              </li>
              <li className="stagger">
                <p>
                  Utilized low-power mode during down time to extend battery
                  life
                </p>
              </li>
              <li className="stagger">
                <p>Worked with microcontrollers specifically Particle Borons</p>
              </li>
            </ul>
          </div>
          <div className="flex flex-col rounded w-full h-full justify-center items-center align-middle gap-2">
            <div className="flex flex-col w-full h-full justify-start items-center align-middle gap-5">
              <div className="flex flex-row justify-center gap-5 w-full">
                <img
                  src="/scheduler_1.png"
                  alt="MSU Irrigation Scheduler"
                  className="stagger-2 h-56 rounded"
                  style={{ height: "224px" }}
                />
                <div className="flex flex-col gap-4">
                  <h2 className="stagger-2 text-md md:text-lg text-[#18453B] font-bold">
                    MSU Irrigation Scheduler
                  </h2>
                  <hr className="stagger-2" />
                  <div className="flex flex-row justify-start gap-4">
                    <div className="stagger-2 h-12 w-12">
                      <I_Dart />
                    </div>
                    <div className="stagger-2 h-12 w-12">
                      <I_Flutter />
                    </div>
                    <div className="stagger-2 h-12 w-12">
                      <I_Firebase />
                    </div>
                  </div>
                  <p className="stagger-2 text-xs md:text-sm text-[#18453B] text-wrap">
                    Maintained and updated the MSU Irrigation Scheduler, a
                    Flutter application that gave farmers the ability to
                    schedule irrigation based on weather forecasts and soil
                    moisture levels
                  </p>
                </div>
              </div>
              <div className="flex flex-row justify-start gap-3 w-full">
                <div className="flex flex-col gap-4">
                  <p className="stagger-2 text-xs md:text-sm text-[#18453B] text-wrap">
                    This significantly improved the user experience and
                    responsiveness of the application
                  </p>
                  <ul className="text-xs md:text-sm text-[#18453B] text-wrap list-disc pl-5">
                    <li className="stagger-2">
                      <p>
                        Reduced load times by 33% by optimizing data retrieval
                        methods
                      </p>
                    </li>
                    <li className="stagger-2">
                      <p>
                        Active userbase of 300+ farmers across Michigan
                      </p>
                    </li>
                    <li className="stagger-2">
                      <p>
                        Utilized Firebase functions to reduce the number of
                        fetch requests by the client
                      </p>
                    </li>
                  </ul>
                </div>
                <img
                  src="/scheduler_2.png"
                  alt="MSU Irrigation Scheduler"
                  className="stagger-2 h-56 rounded"
                  style={{ height: "224px" }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col rounded w-full h-full justify-center items-center align-middle gap-2">
            <div className="flex flex-col w-full h-full justify-start items-center align-middle gap-5">
              <div className="flex flex-row justify-center gap-5 w-full">
                <img
                  src="/sure_1.png"
                  alt="MSU:SURE Home Page"
                  className="stagger-3 h-56 rounded"
                  style={{ height: "224px" }}
                />
                <div className="flex flex-col gap-4">
                  <h2 className="stagger-3 text-md md:text-lg text-[#18453B] font-bold">
                    MSU:SURE
                  </h2>
                  <hr className="stagger-3" />
                  <div className="flex flex-row justify-start gap-4">
                    <div className="stagger-3 h-12 w-12">
                      <I_TS />
                    </div>
                    <div className="stagger-3 h-12 w-12">
                      <I_React />
                    </div>
                    <div className="stagger-3 h-12 w-12">
                      <I_Firebase />
                    </div>
                  </div>
                  <p className="stagger-3 text-xs md:text-sm text-[#18453B] text-wrap">
                    Designed and developed the MSU: System Uniformity & Rate Evaluation (SURE) app
                  </p>
                </div>
              </div>
              <div className="flex flex-row justify-start gap-3 w-full">
                <div className="flex flex-col gap-4">
                  <p className="stagger-3 text-xs md:text-sm text-[#18453B] text-wrap">
                    Significantly improves the process of evaluating irrigation systems by
                    allowing users to input data and generate reports within minutes
                  </p>
                  <ul className="text-xs md:text-sm text-[#18453B] text-wrap list-disc pl-5">
                    <li className="stagger-3">
                      <p>
                        4 different user groups with different permissions
                      </p>
                    </li>
                    <li className="stagger-3">
                      <p>
                        Scalable, allowing for future expansion to other universities and states
                      </p>
                    </li>
                    <li className="stagger-3">
                      <p>
                        Optimized for one handed use while on the field
                      </p>
                    </li>
                  </ul>
                </div>
                <img
                  src="/sure_2.png"
                  alt="MSU:SURE"
                  className="stagger-3 h-56 rounded"
                  style={{ height: "224px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default function Experience() {
//   // #052f73
//   return (
//     <Carousel className="max-w-[1920px] max-h-[1080px] w-full h-[85vh] flex flex-col items-center justify-center">
//       <CarouselContent>
//         <CarouselItem className="w-full">
//           {/* <div className="p-5 h-full bg-gradient-to-bl from-green-400 to-[#18453B] rounded-xl"> */}
//           <MSU />
//           {/* </div> */}
//         </CarouselItem>
//         <CarouselItem className="w-full">
//           <div className="p-5 h-full bg-gradient-to-bl from-[#052f73] to-blue-400 rounded-xl">
//             <JHUAPL />
//           </div>
//         </CarouselItem>
//       </CarouselContent>
//     </Carousel>
//   );
// }
