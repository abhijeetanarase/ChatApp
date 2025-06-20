import { LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logOut } from '../features/auth/simpleAuthSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const UserProfile = () => {

  const dispath = useDispatch();

  const navigate = useNavigate()

  const onLogout = () => {
    //  dispath(logOut());
    const token = localStorage.removeItem('authToken');
    if (!token) {
      navigate("/login")
    }

  }






  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div className="flex items-center">
        <img
          src="https://i.pravatar.cc/150?img=5"
          alt="My profile"
          className="w-10 h-10 rounded-full border-2 border-blue-500 dark:border-blue-400"
        />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">You</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
            Online
          </p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default UserProfile;