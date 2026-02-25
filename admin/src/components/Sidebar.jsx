import React from 'react'
import logo from "../assets/logoo.png"
import logosmall from "../assets/logoo.png"
import addsong from '../assets/add_song.png'
import songicon from "../assets/song_icon.png"
import addalbum from "../assets/add_album.png"
import albumicon from "../assets/album_icon.png"
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='bg-[#003A10] min-h-screen pl-[4vw]'>
        <img src={logo} alt="" className='mt-5 w-[max(10vw,100px)] hidden sm:block' />
        <img src={logosmall} alt="" className='mt-5 w-[max(5vw,40px)] sm:hidden mr-5 block'/>

        <div className='flex flex-col gap-5 mt-10 '>
            <NavLink to='/add-song' className='flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium '>
                   <img src={addsong} className='w-5' alt="" />
                   <p className='hidden sm:block'>Add Song</p>
            </NavLink>
            <NavLink  to='/list-song' className='flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium '>
                   <img src={songicon} className='w-5' alt="" />
                   <p className='hidden sm:block'>List Song</p>
            </NavLink>
            <NavLink  to='/add-album' className='flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium '>
                   <img src={addalbum} className='w-5' alt="" />
                   <p className='hidden sm:block'>Add Album</p>
            </NavLink>
            <NavLink  to='/list-album' className='flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium '>
                   <img src={albumicon} className='w-5' alt="" />
                   <p className='hidden sm:block'>List Album</p>
            </NavLink>

        </div>
        
    </div>
  )
}

export default Sidebar