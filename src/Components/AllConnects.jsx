import React from 'react';
import { BsServer } from "react-icons/bs";
import { SiLinuxserver } from "react-icons/si";




function AllConnects() {
  
 
  return (
   
    <div className='pt-10 pb-11 px-4'>
      
      {/* Header */}
      <div className='flex w-full items-center justify-center'>
        <h1 className='text-3xl md:text-5xl text-blue-900 font-bold text-center'>
          All Connections
        </h1>
      </div>

      {/* BCP Server Mumbai Section */}
      <div className='mt-10'>
        <div className="flex items-center font-bold text-xl sm:text-3xl text-violet-900">
          <h1 className="mr-2">BCP Server Mumbai</h1>
          <BsServer className='text-teal-900' /> 


        </div>

        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 m-1'>
        <div className="flex flex-col font-semibold gap-2 p-4 items-center justify-center bg-red-100 rounded-full text-center cursor-pointer hover:bg-red-200 transition-colors duration-200">
  DB Server
</div>
          <div className="flex flex-col gap-2 p-4 font-semibold items-center justify-center bg-teal-100 rounded-full text-center cursor-pointer hover:bg-teal-200 transition-colors duration-200">
      
            Google Chrome
          </div>
          <div className="flex p-4 items-center font-semibold justify-center bg-purple-200 rounded-full text-center cursor-pointer hover:bg-purple-300  transition-colors duration-200  ">
            Linux Demo
          </div>
          <div className="flex p-4 items-center font-semibold justify-center bg-indigo-100 rounded-full text-center cursor-pointer hover:bg-indigo-200 transition-colors duration-200">
            Notepad
          </div>
        </div>
      </div>

      {/* DC Server Section */}
      <div className='mt-10'>
        <div className="flex items-center font-bold text-xl sm:text-3xl text-violet-900">
          <h1 className="mr-2">DC Server</h1>
          <SiLinuxserver className='text-blue-900' />

        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6'>
          <div className="flex p-4 items-center justify-center font-semibold bg-[#9EC6F3] rounded-full text-center cursor-pointer">
            PROXY SERVER
          </div>
          <div className="flex p-4 items-center justify-center font-semibold bg-[#c6f4ff] rounded-full text-center cursor-pointer">
            SQL Server Management Studio
          </div>
          <div className="flex p-4 items-center justify-center font-semibold bg-[#FFF1D5] rounded-full text-center cursor-pointer">
            Window Server
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllConnects;
