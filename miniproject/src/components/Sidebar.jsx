import React from 'react'
import {assets} from "../assets/assets"
import { useNavigate } from 'react-router-dom'
import Face from './Face';
import logo from '../assets/logoo.png'

const Sidebar = () => {

    const navigate = useNavigate();
  return (
    <div className='w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex'>
        <div className='bg-[#121212] h-[30%] gap-1 rounded flex flex-col justify-around'>
            <div className=' items-center gap-3 pl-8 cursor-pointer'>
                <img className='w-30' src={logo} alt=""/>

            </div>
            <div onClick={()=>navigate('/')} className='flex items-center gap-3 pl-8 cursor-pointer'>
                <img className='w-6' src={assets.home_icon} alt=""/>
                <p className='font-bold'>Home</p>
            </div>
            <div onClick={()=>navigate('/search')} className='flex items-center gap-3 pl-8 cursor-pointer'>
                <img className='w-6' src={assets.search_icon} alt=""/>
                <p className='font-bold'>Search</p>
            </div>
        </div>
        <div className='bg-[#121212] h-[85%] rounded '>
            <div className='p-4 flex items-center justify-between '>
                <div className=' flex items-center gap-3 '>
                    <img className='w-8 ' src={assets.stack_icon} alt=""/>
                    <p className='font-semibold'>New feature</p>

                </div>
                <div className='flex items-center gap-3 '>
                    {/* <img className='w-5' src={assets.arrow_icon} alt=""/>
                    <img className='w-5' src={assets.plus_icon} alt=""/> */}

                </div>

            </div>
            <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4'>
                <h1>Detect Your Mood</h1>
                <p className='font-light '>Effortlessly identify your mood in real-time</p>
                <button onClick={() => navigate('/detect')} className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4 '>detect mood</button>

            </div>
            {/* <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4'>
                <h1>Let's find some pordcasts to follow</h1>
                <p className='font-light '>we'll keep you update on new episodes</p>
                <button  className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>Browse prodcasts</button>

            </div> */}

        </div>

    </div>
  )
}

export default Sidebar