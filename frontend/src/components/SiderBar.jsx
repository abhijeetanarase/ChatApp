import { Search, Moon, Sun, Plus, MessageSquare, Video, Phone, MailPlus } from 'lucide-react';
import UserProfile from './UserProfile';
import { useEffect, useState } from 'react';
import AddContactPopup from './AddContactPopup';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts, useContact, setShowAddContactPopup, setCurrentChat } from '../features/contact/contactSlice';
import { setActiveTab } from '../features/sidebar/siderBarSlice';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSiderBar } from '../features/sidebar/siderBarSlice';
import { motion, AnimatePresence } from 'framer-motion';
import InvitationsList from "./InvitationsList";
import IncomingCallModal from '../pages/video/IncomingCallModal';
import { useSocket } from '../context/SocketContext';

const Sidebar = ({ darkMode, toggleDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentChat } = useSelector(useContact);
  const { activeTab } = useSelector(useSiderBar);
  const { onlineUsers, showAddContactPopup } = useSelector(useContact);
  const [secondarySidebarOpen, setSecondarySidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const {callStatus } = useSocket()

  useEffect(() => {
    dispatch(fetchContacts());
    // Check if mobile on initial render and on resize
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const filteredUsers = onlineUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 md:flex-row">
      {/* Desktop Secondary Sidebar - Slim Navigation (hidden on mobile) */}
      {callStatus == 'ringing' &&  <IncomingCallModal/>}
      <motion.div 
        initial={{ width: 64 }}
        animate={{ width: secondarySidebarOpen ? 64 : 0 }}
        className="hidden md:flex bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col items-center py-4 overflow-hidden"
      >
        <div className="flex flex-col items-center space-y-4 w-full">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { dispatch(setActiveTab('chats')); navigate("/chat") }}
            className={`p-3 rounded-xl transition-all ${activeTab === 'chats'
              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 shadow-md'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
            title="Chats"
          >
            <MessageSquare className="h-5 w-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { dispatch(setActiveTab('video')); navigate("/video") }}
            className={`p-3 rounded-xl transition-all ${activeTab === 'video'
              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 shadow-md'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
            title="Video Calls"
          >
            <Video className="h-5 w-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { dispatch(setActiveTab('voice')); navigate("/audio") }}
            className={`p-3 rounded-xl transition-all ${activeTab === 'voice'
              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 shadow-md'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
            title="Voice Calls"
          >
            <Phone className="h-5 w-5" />
          </motion.button>

          {/* Invitation Tab */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(setActiveTab('invitations'))}
            className={`p-3 rounded-xl transition-all ${activeTab === 'invitations'
              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 shadow-md'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
            title="Invitations"
          >
            <MailPlus className="h-5 w-5" />
          </motion.button>
        </div>

        <div className="mt-auto">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSecondarySidebarOpen(!secondarySidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
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
          </motion.button>
        </div>
      </motion.div>

      {/* Main Sidebar - Contacts List */}
        {
          currentChat._id && isMobile ? (<Outlet/>) : (  <motion.div
        initial={{ width: 288 }}
      
  animate={{ 
    width: isMobile ? '100vw' : (secondarySidebarOpen ? 288 : 320)
  }}
        className="flex flex-col border-r border-gray-200 dark:border-gray-800 flex-1"
      >
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center"
        >
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Messages</h1>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(setShowAddContactPopup())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              title="Add contact"
            >
              <Plus className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.button>
          </div>
        </motion.div>
        
        {/* Search */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="p-3 border-b border-gray-200 dark:border-gray-800"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <motion.input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 transition-all"
              whileFocus={{ scale: 1.01 }}
            />
          </div>
        </motion.div>
        
        {/* Contacts List */}
     
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'invitations' ? (
            <InvitationsList />
          ) : (
            <>
              {activeTab === 'chats' && (
                <AnimatePresence>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <motion.div
                        key={user._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center p-3 cursor-pointer transition-all ${
                          currentChat._id === user._id
                            ? 'bg-indigo-50/50 dark:bg-gray-800'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => dispatch(setCurrentChat(user))}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="relative flex-shrink-0">
                          <motion.img
                            src={user?.picture || "https://i.pravatar.cc/150?img=1"}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          />
                          <motion.span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-950 ${
                              user.status === 'online'
                                ? 'bg-green-500'
                                : user.status === 'away'
                                ? 'bg-yellow-500'
                                : 'bg-gray-400'
                            }`}
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: user.status === 'online' ? [0.8, 1, 0.8] : 1
                            }}
                            transition={{
                              duration: user.status === 'online' ? 1.5 : 0,
                              repeat: user.status === 'online' ? Infinity : 0
                            }}
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
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full p-6 text-center"
                    >
                      <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                        <MessageSquare className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                        No contacts found
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {searchQuery ? 'Try a different search' : 'Add new contacts to get started'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
              
              {activeTab !== 'chats' && activeTab !== 'invitations' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full p-6 text-center"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.9, 1, 0.9]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-3"
                  >
                    {activeTab === 'video' ? (
                      <Video className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <Phone className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    )}
                  </motion.div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {activeTab === 'video' ? 'Video Calls' : 'Voice Calls'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your {activeTab === 'video' ? 'video' : 'voice'} call history will appear here
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>
        
        {/* User Profile */}
        <UserProfile />

        {/* Add Contact Popup */}
        <AnimatePresence>
          {showAddContactPopup && (
            <AddContactPopup />
          )}
        </AnimatePresence>
      </motion.div>)
       }
    

      {/* Mobile Bottom Navigation (shown only on mobile) */}
      <div className={`md:hidden ${isMobile && currentChat._id ? "hidden" : "block"}  bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center py-2`}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { dispatch(setActiveTab('chats')); navigate("/chat") }}
          className={`p-3 rounded-xl transition-all ${activeTab === 'chats'
            ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 shadow-md'
            : 'text-gray-500 dark:text-gray-400'}`}
          title="Chats"
        >
          <MessageSquare className="h-5 w-5" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { dispatch(setActiveTab('video')); navigate("/video") }}
          className={`p-3 rounded-xl transition-all ${activeTab === 'video'
            ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 shadow-md'
            : 'text-gray-500 dark:text-gray-400'}`}
          title="Video Calls"
        >
          <Video className="h-5 w-5" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { dispatch(setActiveTab('voice')); navigate("/audio") }}
          className={`p-3 rounded-xl transition-all ${activeTab === 'voice'
            ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 shadow-md'
            : 'text-gray-500 dark:text-gray-400'}`}
          title="Voice Calls"
        >
          <Phone className="h-5 w-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;