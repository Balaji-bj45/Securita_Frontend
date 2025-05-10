import React from 'react'
import Navbar from './Navbar'

function Banner() {
  return (
    <div className='pt-5 '>

      <div className=' flex w-full items-center justify-center'>
        <h1 className=' text-3xl md:text-5xl text-blue-900 font-bold'>
          Recent Connection
        </h1>
      </div>

<div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-5 px-10">

  <div className="flex flex-col items-center ">
          <img 
            src="https://www.bleepstatic.com/tutorials/windows-10/elevated-command-prompt/elevated-command-prompt.jpg" 
            alt="Image 1" 
            className="w-full h-60 object-cover rounded-lg"
          />
          
        </div>
  <div className="flex flex-col items-center">
          <img 
            src="https://www.bleepstatic.com/tutorials/windows-10/elevated-command-prompt/elevated-command-prompt.jpg" 
            alt="Image 1" 
            className="w-full h-60 object-cover rounded-lg"
          />
         
        </div>
  <div className="flex flex-col items-center">
          <img 
            src="https://www.bleepstatic.com/tutorials/windows-10/elevated-command-prompt/elevated-command-prompt.jpg" 
            alt="Image 1" 
            className="w-full h-60 object-cover rounded-lg"
          />
          
        </div>
  
  
 
 
</div>

    
        
    </div>
  )
}

export default Banner