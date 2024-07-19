import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AccountCircle } from "@mui/icons-material";


export default function Register() {

  const username = useRef();
  const email = useRef();
  const password = useRef();
  const ConfirmePassword = useRef();
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;

      data.append('name', fileName);
      data.append('file', file);

      try {
        await axios.post('/api/upload', data);
        const newUser = {
          username: username.current.value,
          email: email.current.value,
          password: password.current.value,
          profilePicture: fileName
        };
        registerUser(newUser);
      } catch (error) {
        console.log(error);
      }
    } else {
      registerUser(newUser);
    }
  };

  const registerUser = async (user) => {
    if (ConfirmePassword.current.value !== password.current.value) {
      ConfirmePassword.current.setCustomValidity('Check your password again!');
    } else {
      try {
        await axios.post('/api/auth/register', user);
      } catch (error) {
        console.log(error);
      }
    }
    navigate("/login");
  };

{/*  const handelForm = () => {
    if (
      username === null ||
      email === null ||
      password === null ||
      ConfirmePassword === null ||
      file === null
    ) {
      <Toast>
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
          <HiExclamation className="h-5 w-5" />
        </div>
        <div className="ml-3 text-sm font-normal">Please check your register form.</div>
        <Toast.Toggle />
      </Toast>
    }
  };*/}



  return (
    <div>
      <div className="flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-r from-slate-900 to-slate-700">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">

          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Register your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>

            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
                User name
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  ref={username}
                  required
                  className="block w-full p-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  ref={email}
                  required
                  className="block w-full p-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  ref={password}
                  required
                  className="block w-full p-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="ConfirmePassword" className="block text-sm font-medium leading-6 text-white">
                  Confirme Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="ConfirmePassword"
                  name="ConfirmePassword"
                  type="password"
                  ref={ConfirmePassword}
                  required
                  className="block w-full p-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="file" className="flex text-sm font-medium leading-6 text-white">
                  <AccountCircle className=" text-white text-lg cursor-pointer" />
                  <p className=" ml-2 cursor-pointer">Profile picture</p>
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept='.png , .jpeg , .jpg'
                  onChange={(e) => { setFile(e.target.files[0]) }}
                  required
                  className=" hidden"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-gradient-to-r from-blue-800 to-indigo-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                //onClick={handelForm}
              >
                Register
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-white">
            Already registed?{' '}
            <Link to="/login" className="font-semibold leading-6 text-blue-600 hover:bg-gradient-to-bl from-orange-500 via-fuchsia-600 to-cyan-400 bg-clip-text hover:text-transparent">
              Login with Swift
            </Link>
          </p>
        </div>



      </div>

    </div>
  )
}
