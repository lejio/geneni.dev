// import React from "react";
// import msu_icon from "../images/msu_helmet.svg";
// import MSU_1 from "../images/MSU_1.jpg";
// import MSU_2 from "../images/MSU_2.jpg";
// import MSU_3 from "../images/MSU_3.jpg";
// import MSU_4 from "../images/MSU_4.jpg";

// import I_CPP from "../images/I_CPP";
// import I_Astro from "../images/I_Astro";
// import I_TS from "../images/I_TS";
// import I_C from "../images/I_C";

// export default function MSU() {
//   const techStack_1 = [I_CPP, I_C];
//   const techStack_2 = []

//   return (
//     <div className="w-full h-full flex flex-col justify-start align-middle items-center gap-5">
//       <div className="flex text-[#18453B] flex-col justify-center items-center align-middle">
//         <img className="w-10 md:w-20" src={msu_icon.src} alt="MSU Logo" />
//         <div className="flex flex-col justify-center items-center align-middle">
//           <h2 className="text-base md:text-xl">Michigan State University</h2>
//           <p className="text-sm">Irrigation Laboratory</p>
//         </div>
//       </div>

//       <div className=" text-white flex flex-col gap-5 h-full">
//         <div className=" w-[300px] md:w-[600px] flex flex-row gap-5">
//           <img
//             className="w-28 md:h-auto md:w-64 rounded-xl object-cover"
//             src={MSU_1.src}
//             alt="Pic at MSU"
//           />
//           <div className="w-full flex flex-col gap-2">
//             <h2 className="text-sm md:text-xl">Full Stack Developer</h2>
//             <div className="flex flex-row gap-2">
//               {techStack_1.map((Icon, idx) => {
//                 return (
//                   <div key={idx} className="w-6 h-6 md:w-10 md:h-10">
//                     <Icon />
//                   </div>
//                 );
//               })}
//             </div>
//             <p className=" text-xs md:text-base text-wrap">
//                 Programmed the LOCOMOS line of sensors that are being used across Michigan, and now Washington State. Improved battery life by 100% with ULP mode and local caching, allowing sensors to survive the winter during low sunlight seasons.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
