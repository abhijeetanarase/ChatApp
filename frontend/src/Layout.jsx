import { Outlet } from 'react-router-dom';
import Sidebar from '../components/SiderBar';
import IncomingCallModal from './pages/video/IncomingCallModal';
import { useState, useEffect } from 'react';

const Layout = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // --- Context से कॉलिंग स्टेट ---
 

  return (
    <div className="flex h-screen">
      <div className="dark:bg-gray-900 dark:text-gray-100 flex flex-col w-full">
        <div className="flex h-full">
          <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
         
          <main className="flex-1 overflow-auto hidden sm:block">
           
            <Outlet />
          </main>
        </div>
   
      
     
      </div>
    </div>
  );
};

export default Layout; 