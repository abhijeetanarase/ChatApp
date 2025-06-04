import { Search, Moon, Sun, Plus, MessageSquare, Video, Phone } from 'lucide-react';
import UserProfile from './UserProfile';
import { useEffect, useState } from 'react';
import AddContactPopup from './AddContactPopup';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts, useContact, setShowAddContactPopup, setCurrentChat } from '../features/contact/contactSlice';
import { setActiveTab } from '../features/sidebar/siderBarSlice';
import { useNavigate } from 'react-router-dom';
import { useSiderBar } from '../features/sidebar/siderBarSlice';

const Sidebar = ({ darkMode, toggleDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {currentChat} = useSelector(useContact);
  const {activeTab} = useSelector(useSiderBar);
  const { onlineUsers, showAddContactPopup } = useSelector(useContact);
  const [secondarySidebarOpen, setSecondarySidebarOpen] = useState(true);    

  useEffect(() => {
    dispatch(fetchContacts());
  }, []);

  return (
    <div className="flex h-full bg-white dark:bg-gray-800">
      {/* Secondary Sidebar - Slim Navigation */}
      <div className={`${secondarySidebarOpen ? 'w-16' : 'w-0'} bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 flex flex-col items-center py-4 transition-all duration-200 overflow-hidden`}>
        <div className="flex flex-col items-center space-y-4 w-full">
          <button
            onClick={() => {dispatch(setActiveTab('chats')) , navigate("/chat")}}
            className={`p-3 rounded-xl transition-colors ${activeTab === 'chats' 
              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300' 
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            title="Chats"
          >
            <MessageSquare className="h-5 w-5" />
          </button>

          <button
            onClick={() => {dispatch(setActiveTab('video') ), navigate("/video")}}
            className={`p-3 rounded-xl transition-colors ${activeTab === 'video' 
              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300' 
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            title="Video Calls"
          >
            <Video className="h-5 w-5" />
          </button>

          <button
            onClick={() => {dispatch(setActiveTab('voice')) ,  navigate("/audio")}}
            className={`p-3 rounded-xl transition-colors ${activeTab === 'voice' 
              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300' 
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            title="Voice Calls"
          >
            <Phone className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-auto">
          <button
            onClick={() => setSecondarySidebarOpen(!secondarySidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
            title={secondarySidebarOpen ? 'Collapse' : 'Expand'}
          >
            {secondarySidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Main Sidebar - Contacts List */}
      <div className={`${secondarySidebarOpen ? 'w-72' : 'w-80'} flex flex-col border-r border-gray-200 dark:border-gray-600 transition-all duration-200`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Messages</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => dispatch(setShowAddContactPopup())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              title="Add contact"
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-600">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
        
        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'chats' && onlineUsers.map((user) => (
            <div
              key={user._id}
              className={`flex items-center p-3 cursor-pointer transition-colors ${
                currentChat._id === user._id 
                  ? 'bg-indigo-50 dark:bg-gray-700' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => dispatch(setCurrentChat(user))}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={user?.picture || "https://i.pravatar.cc/150?img=1"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                    user.status === 'online'
                      ? 'bg-green-500'
                      : user.status === 'away'
                      ? 'bg-yellow-500'
                      : 'bg-gray-400'
                  }`}
                />
              </div>
              <div className="ml-3 min-w-0">
                <h3 className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                  {user.name}
                </h3>
                <p className="text-xs truncate text-gray-500 dark:text-gray-400">
                  {user.status === 'online'
                    ? 'Online'
                    : user.status === 'away'
                    ? 'Away'
                    : 'Offline'}
                </p>
              </div>
            </div>
          ))}
          
          {activeTab !== 'chats' && (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
                {activeTab === 'video' ? (
                  <Video className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                ) : (
                  <Phone className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                {activeTab === 'video' ? 'Video Calls' : 'Voice Calls'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your {activeTab === 'video' ? 'video' : 'voice'} call history will appear here
              </p>
            </div>
          )}
        </div>
        
        {/* User Profile */}
        <UserProfile />

        {/* Add Contact Popup */}
        {showAddContactPopup && <AddContactPopup />}
      </div>
    </div>
  );
};

export default Sidebar;