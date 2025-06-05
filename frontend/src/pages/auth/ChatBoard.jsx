import {
  UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

const ChatBoard = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Empty State Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Logo with Glow */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center mb-10"
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-xl bg-indigo-500/20 blur-lg animate-pulse"></div>
              <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-xl bg-indigo-600 dark:bg-indigo-700 shadow-xl">
                <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" />
                  <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="currentColor" />
                  <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl mt-4 font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text">
              Quick Ping
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
              Lightning fast messaging
            </p>
          </motion.div>

          {/* Message Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              No conversations selected
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Choose a contact from your list or start a new conversation. Your messages will appear here in a clean, distraction-free environment.
            </p>
          </motion.div>

          {/* Add New Contact Button */}
        <div className="flex justify-center">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold shadow-md transition-all"
  >
    <UserPlus className="w-5 h-5" />
    Add New Contact
  </motion.button>
</div>


          {/* Optional Tip */}
          <motion.div
            className="mt-6 text-xs text-gray-400 dark:text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {/* Tip or shortcut if needed */}
            {/* Pro Tip: Press ⌘ + N to start a new chat */}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatBoard;
