import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [state, setState] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};

    if (state === 'register' && !name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // stop if validation fails

    try {
      if (state === 'register') {
        const res = await axios.post('http://localhost:4000/api/auth/register', {
          name,
          email,
          password,
        });

        const data = res.data;

        localStorage.setItem('user', JSON.stringify({ name: data.name }));
        localStorage.setItem('token', data.token);
        alert('Account created!');
      } else {
        const res = await axios.post('http://localhost:4000/api/auth/login', {
          email,
          password,
        });

        const data = res.data;

        localStorage.setItem('user', JSON.stringify({ name: data.name }));
        localStorage.setItem('token', data.token);
        alert('Login successful!');
      }

      navigate('/');
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Something went wrong!';
      alert(errorMsg);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 backdrop-blur-md bg-opacity">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl bg-[#242424] text-white"
      >
        <p className="text-2xl font-medium m-auto text-white">
          <span className="text-indigo-400">User</span> {state === 'login' ? 'Login' : 'Sign Up'}
        </p>

        {state === 'register' && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Type here"
              className="border border-gray-600 bg-black text-white rounded w-full p-2 mt-1 outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Type here"
            className="border border-gray-600 bg-black text-white rounded w-full p-2 mt-1 outline-none focus:ring-2 focus:ring-indigo-500"
            type="email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Type here"
            className="border border-gray-600 bg-black text-white rounded w-full p-2 mt-1 outline-none focus:ring-2 focus:ring-indigo-500"
            type="password"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        {state === 'register' ? (
          <p className="text-sm text-gray-300">
            Already have an account?{' '}
            <span
              onClick={() => {
                setState('login');
                setErrors({});
              }}
              className="text-indigo-400 cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p className="text-sm text-gray-300">
            Create an account?{' '}
            <span
              onClick={() => {
                setState('register');
                setErrors({});
              }}
              className="text-indigo-400 cursor-pointer"
            >
              click here
            </span>
          </p>
        )}

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 transition-all text-white w-full py-2 rounded-md cursor-pointer"
        >
          {state === 'register' ? 'Create Account' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
