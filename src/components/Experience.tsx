import { useEffect } from "react";

import { animate, stagger } from "framer-motion";
// import MSU_Helmet from "../images/msu_helmet.svg";
// import MSU_Seal from "../images/msu_seal.svg";

import I_C from "../images/I_C";
import I_CPP from "../images/I_CPP";
import JHUAPL from "./JHUAPL";
// import MSU from "./MSU";

export default function Experience() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".stagger"));
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
    };
  }, []);
  // #052f73
  return (
    <div className="relative max-w-[1920px] md:max-h-[1080px] w-full h-auto md:h-[85vh] flex flex-col gap-5 rounded-xl md:border md:border-solid md:border-[#18453B] items-center align-middle">
      <div className="absolute inset-0 p-10">
        <img
          src="/msu_helmet.svg"
          alt="Background Logo"
          className="w-full h-full object-contain opacity-[0.10] z-0 pointer-events-none"
        />
      </div>

      <div className="relative z-10 p-5 w-full h-full flex flex-col justify-evenly items-center align-middle">
        <div className="flex flex-col justify-center items-center align-middle gap-2">
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

        <div className="flex w-full h-full pt-5 flex-row  gap-5">
          <div className="flex flex-col rounded w-full h-full justify-start items-center align-middle gap-2">
            <div className="flex flex-row justify-center gap-5 w-full">
              <img
                src="/MSU_1.jpg"
                alt="LOCOMOS Sensor"
                className="h-52 rounded"
              />
              <div className="flex flex-col gap-2">
                <h2 className="text-base md:text-md text-[#18453B] font-bold">
                  Low-Cost Monitoring System (LOCOMOS)
                </h2>
                <hr />
                <div className="flex flex-row justify-start">
                  <div className="h-16 w-16">
                    <I_C />
                  </div>
                  <div className="h-16 w-16">
                    <I_CPP />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col rounded w-full h-full bg-green-200 justify-center items-center align-middle gap-2"></div>
          <div className="flex flex-col rounded w-full h-full bg-green-200 justify-center items-center align-middle gap-2"></div>
          <div className="flex flex-col rounded w-full h-full bg-green-200 justify-center items-center align-middle gap-2"></div>
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
