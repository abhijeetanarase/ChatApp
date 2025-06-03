import { CheckCircle2, Mail, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../../utils/api";

export default function UserProfileSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(4);

  // Extract query params
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const nameParam = params.get("name");
  const emailParam = params.get("email");
  const avatarParam = params.get("picture");
  const  id = params.get("id");

  const [user, setUser] = useState({
    name: nameParam || "John Doe",
    email: emailParam || "john@example.com",
    avatar: avatarParam || "https://i.pravatar.cc/150?img=3"
  });
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Store token as Bearer in localStorage if present in query
    if (token && id) {
      localStorage.setItem("authToken", `Bearer ${token}`);
      localStorage.setItem("userId" , id);
    }
    
    // If no query params but token exists, fetch user profile
    if (!token && !nameParam && !emailParam && !avatarParam) {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        api.get("/user/profile")
          .then(res => {
            setUser({
              name: res.data.name,
              email: res.data.email,
              avatar: res.data.picture || "https://i.pravatar.cc/150?img=3"
            });
            setError(null);
          })
          .catch((err) => {
            setUser({
              name: "John Doe",
              email: "john@example.com",
              avatar: "https://i.pravatar.cc/150?img=3"
            });
            setError(
              err?.response?.data?.message ||
              err?.message ||
              "Failed to fetch user profile."
            );
          });
      }
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/chat');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dropdown for logout
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.targe)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleGoToMailbox = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Login Successful!
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            Welcome back to OneBox. Redirecting in {countdown} seconds...
          </p>

          {error && (
            <div className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-center">
              <img
                className="h-12 w-12 rounded-full"
                src={user.avatar}
                alt={user.name}
                onError={(e) => {
                  (e.target).src = "https://i.pravatar.cc/150?img=3";
                }}
              />
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500 flex items-center">
                  <Mail className="mr-1 h-4 w-4" />
                  {user.email}
                </p>
              </div>
              <div className="relative ml-4" ref={dropdownRef}>
                <button
                  className="flex items-center px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setDropdownOpen((open) => !open)}
                  type="button"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoToMailbox}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Mailbox Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}