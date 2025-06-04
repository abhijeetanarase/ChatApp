import { CheckCircle2, Mail, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSimpleAuth, setUser } from "../../features/auth/simpleAuthSlice";

export default function UserProfileSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(selectSimpleAuth);
  const [countdown, setCountdown] = useState(5); // 5-second countdown

  // Extract query params
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const nameParam = params.get("name");
  const emailParam = params.get("email");
  const avatarParam = params.get("picture");
  const id = params.get("id");

  useEffect(() => {
    // Store token as Bearer in localStorage if present in query
    if (nameParam && emailParam) {
      dispatch(setUser({
        name: nameParam,
        email: emailParam,
        avatar: avatarParam,
      }))
    }

    if (token && id) {
      localStorage.setItem("authToken", `Bearer ${token}`);
      localStorage.setItem("userId", id);
    }

    // If no query params but token exists, fetch user profile
    if (!token && !nameParam && !emailParam && !avatarParam) {
      const storedToken = localStorage.getItem("authToken");
      console.log(storedToken);
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/chat");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoToMailbox = () => {
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome {user?.name}!
          </h2>
          <p className="text-gray-600 mb-8">
            Your account has been successfully authenticated
          </p>

          {/* Countdown notice */}
          <p className="text-sm text-gray-500 mb-6">
            Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>

          {/* User Profile Card */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="relative group">
                  <div className="relative">
                    <img
                      className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md cursor-pointer"
                      src={user?.avatar}
                      alt={user?.name}
                    />
                  </div>
                </div>
                <div className="ml-4 text-left">
                  <p className="text-lg font-semibold text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8">
            <button
              onClick={handleGoToMailbox}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-md font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${"hover:-translate-y-0.5"}`}
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}