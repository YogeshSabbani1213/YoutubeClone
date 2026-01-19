import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Login({ setAuthView }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  async function handleLogin() {
    try {

      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        })
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.message || 'Login failed');
        return;
      }
      // console.log(data)
      toast.success('Login successful', {
        style: { fontSize: "20px", borderRadius: '10px', background: '#333', color: '#fff' }
      })
      login(data)
      setEmail("");
      setPassword("")
      setAuthView(null)
    }
    catch (error) {
      console.error(error);
      toast.error('something went wrong');
    }

  }
  return (
    <section className=" bg-gray-50 dark:bg-gray-900 transition-all duration-500">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className=" w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 relative">

            <h1 className="text-xl lg:text-3xl  font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Log in to your account
            </h1>

            <form className="space-y-4 md:space-y-6">

              {/* Email */}
              <div>
                <label className="block lg:text-xl mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="lg:text-xl  bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5"
                  placeholder="name@company.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block lg:text-xl  mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 lg:text-lg  border border-gray-300 rounded-lg block w-full p-2.5"
                  placeholder="••••••••"
                />
              </div>

              {/* Sign in */}
              <button
                type="button"
                className=" lg:text-xl  w-full bg-blue-500 text-white rounded-lg py-2"
                onClick={() => handleLogin()}
              >
                Log in
              </button>

              {/* Close */}
              <button
                type="button"
                className=" lg:text-xl w-full bg-red-600 text-white rounded-lg py-2"
                onClick={() => setAuthView(null)}
              >
                Close
              </button>

              {/* Switch to Register */}
              <p className=" lg:text-xl text-sm text-gray-500 text-center">
                Don’t have an account?{" "}
                <button
                  type="button"
                  className=" lg:text-xl  text-blue-500 font-medium"
                  onClick={() => setAuthView("register")}
                >
                  Sign up
                </button>
              </p>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
