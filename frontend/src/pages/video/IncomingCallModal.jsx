import React, { useEffect } from "react";
import { useSocket } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom";

const IncomingCallModal = () => {
  const { incomingCall, acceptCall, rejectCall, callStatus } = useSocket();
  const navigate = useNavigate();

  
  

   if(callStatus !== 'ringing') return null

  const handleAccept = async () => {
    await acceptCall();
    navigate("/video");
  };

  return (
    <div className="fixed top-6 right-6 z-[9999] max-w-xs w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center animate-slide-in">
      <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
        <div><b>callStatus:</b> {callStatus}</div>
        
      </div>
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center mr-3">
          <span role="img" aria-label="video">📹</span>
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {incomingCall?.callerInfo?.name || "Unknown"}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            आपको वीडियो कॉल कर रहे हैं
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-2">
        <button
          onClick={handleAccept}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-sm font-medium"
        >
          कॉल रिसीव करें
        </button>
        <button
          onClick={rejectCall}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm font-medium"
        >
          कॉल रिजेक्ट करें
        </button>
      </div>
    </div>
  );
};

export default IncomingCallModal;

// Tailwind animation (add in global CSS if not present):
// .animate-slide-in { animation: slide-in 0.3s ease; }
// @keyframes slide-in { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } } 