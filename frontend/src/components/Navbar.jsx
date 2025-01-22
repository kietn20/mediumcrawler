import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearLocalStorage("mediaItems");
    clearLocalStorage("mediaLists");
    clearLocalStorage("currentMediaList");
    setUser(null);
    setIsDropdownOpen(false);
    navigate("/");
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="flex justify-end items-center w-screen h-16 px-3 gap-3 relative">
      <span className="font-heading text-3xl text-[#B1FA63] pb-2">
      </span>
      <div className="relative">
        <img
          src="/logo.svg"
          alt="logo"
          className="w-10 h-10 cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-[#B1FA63] bg-opacity-70 hover:bg-opacity-100 duration-150 rounded-lg shadow-lg z-50 font-heading text-2xl">
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center text-gray-800 hover:rounded-l w-full text-left"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center text-gray-800 hover:rounded-g w-full text-left"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
