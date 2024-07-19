import { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginCall } from "../apiCalls";



export default function Login() {

  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const { user, error, isFetching, dispatch } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginCall({ email: email.current.value, password: password.current.value }, dispatch);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div> 
      <div className="flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-r from-slate-900 to-slate-700">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">

          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Log in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
              <button
                type="submit"

                className="flex w-full justify-center rounded-md bg-gradient-to-r from-blue-800 to-indigo-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {"Login"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-white">
            Not register yet?{' '}
            <Link to="/register" className="font-semibold leading-6 text-blue-600 hover:bg-gradient-to-bl from-orange-500 via-fuchsia-600 to-cyan-400 bg-clip-text hover:text-transparent">
              Register with Swift
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
