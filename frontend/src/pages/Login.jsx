import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      if (!name || !email || !password) {
        toast.error("All fields are required for registration");
        return;
      }
      if (!validateEmail(email)) {
        toast.error("Invalid email format");
        return;
      }
      if (!validatePassword(password)) {
        toast.error("Password must be at least 8 characters long");
        return;
      }
      try {
        const response = await axios.post("/api/auth/register", {
          name,
          email,
          password,
        });
        setUser(response.data);
        toast.success("Registration successful");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (error) {
        toast.error(error.response.data || "Registration failed");
      }
    } else {
      if (!email || !password) {
        toast.error("Email and password are required for sign in");
        return;
      }
      if (!validateEmail(email)) {
        toast.error("Invalid email format");
        return;
      }
      try {
        const response = await axios.post("/api/auth/login", {
          email,
          password,
        });
        setUser(response.data);
        toast.success("Sign in successful");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (error) {
        toast.error(error.response.data || "Sign in failed");
      }
    }
  };

  return (
    <div
      className="w-screen h-screen overflow-y-scroll bg-[#0A0B06] flex flex-col justify-center items-center bg-topography-texture1 gap-10 font-heading"
      style={{
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/topography.svg')",
          opacity: 0.3,
          zIndex: -1,
        }}
      />
      <Toaster />
      <h1 className="font-heading text-[#B1FA63] text-8xl">medium crawler</h1>
      <div className="w-[600px] h-[650px] bg-[#142120] flex flex-col justify-around items-center rounded-[30px] text-white drop-shadow-2xl select-none">
        <div className="flex flex-col justify-center items-center">
          <span className="text-7xl text-[#B1FA63]">
            {isRegister ? "sign up" : "sign in"}
          </span>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center gap-2"
          >
            {isRegister && (
              <div>
                <label htmlFor="name" className="text-2xl flex">
                  name
                </label>
                <input
                  type="text"
                  className="w-[445px] h-[45px] text-2xl outline-none text-[#0A0B06] focus:ring-4 focus:ring-[#8ac847] duration-150 mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="text-2xl flex">
                email
              </label>
              <input
                type="text"
                className="w-[445px] h-[45px] text-2xl outline-none text-[#0A0B06] focus:ring-4 focus:ring-[#8ac847] duration-150 mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-2xl flex">
                password
              </label>
              <input
                type="password"
                className="w-[445px] h-[45px] text-2xl outline-none text-[#0A0B06] focus:ring-4 focus:ring-[#8ac847] duration-150 mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="w-[445px] h-[50px] bg-[#8ac847] opacity-50 hover:opacity-100 duration-150 text-2xl rounded-2xl mt-4">
              {isRegister ? "sign up" : "sign in"}
            </button>
          </form>
        </div>

        <div className="w-[500px] h-1 bg-[#545b4c] rounded-9xl" />

        <div className="flex flex-col justify-center items-center">
          <button
            className="w-[445px] h-[55px] text-2xl rounded-[20px] bg-white text-[#80978F] relative hover:bg-[#0A0B06] hover:text-[#B1FA63] duration-250"
            onClick={() =>
            (window.location.href =
              "http://localhost:8080/oauth2/authorization/google")
            }
          >
            sign in with Google
            <img
              src="/google.png"
              alt="google"
              className="w-8 h-8 absolute top-3 left-12 opacity-70"
            />
          </button>
          {/* <span className="my-2">or</span>
          <button
            className="w-[445px] h-[55px] text-2xl rounded-[20px] bg-white text-[#80978F] relative hover:bg-[#0A0B06] hover:text-[#B1FA63] duration-250"
            onClick={() =>
              (window.location.href =
                "http://localhost:8080/oauth2/authorization/github")
            }
          >
            sign in with Github
            <img
              src="src/assets/github.svg"
              alt="github"
              className="w-8 h-8 absolute top-3 left-12 opacity-70"
            />
          </button> */}
          <span className="my-5">
            {isRegister ? (
              <>
                already a member?{" "}
                <button
                  onClick={() => setIsRegister(false)}
                  className="text-[#B1FA63]"
                >
                  sign in!
                </button>
              </>
            ) : (
              <>
                not a member yet?{" "}
                <button
                  onClick={() => setIsRegister(true)}
                  className="text-[#B1FA63]"
                >
                  sign up!
                </button>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
