
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import Login from './Login';
import React, { useEffect, useState } from 'react';



const Navbar = () => {

  const [user, setUser] = useState(null);


  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    setUser(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    alert('Logged out!');
    navigate('/login');
    window.location.reload(); // force UI update
  };


  const navigate = useNavigate();

  return (
    <>
      <div className='w-full flex justify-between items-center font-semibold'>
        <div className='flex items-center gap-2'>
          <img onClick={() => navigate(-1)} className='w-8 bg-black p-2 rounded-2xl cursor-pointer' src={assets.arrow_left} alt="" />
          <img onClick={() => navigate(1)} className='w-8 bg-black p-2 rounded-2xl cursor-pointer' src={assets.arrow_right} alt="" />

        </div>
        <div className='flex items-center gap-4'>
          <p className='bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer'>Explore premium</p>

          <div className="flex gap-4 items-center">
            {!user ? (
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-black px-4 py-1 rounded"
              >
                Login
              </button>
            ) : (
              <>
                <button onClick={handleLogout} className='bg-black py-1 px-3 rounded-2xl text-[15px] cursor-pointer'>
                  Logout
                </button>
                <div title={user?.name}
                  className='bg-purple-500 text-black w-7 h-7 rounded-full flex items-center justify-center'>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </>
            )}
          </div>



        </div>
      </div>
      <div className='flex items-center gap-2 mt-4'>
        <p className='bg-white text-black px-4 py-1 rounded-2xl cursor-pointer'>All</p>
        <p className='bg-black px-4 py-1 rounded-2xl cursor-pointer '>Music</p>
        <p className='bg-black px-4 py-1 rounded-2xl cursor-pointer'>Podcasts</p>

      </div>
    </>

  )
}

export default Navbar