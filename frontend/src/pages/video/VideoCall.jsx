import { useEffect } from "react";
import { Phone, Video, Mic, MicOff, VideoOff, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useContact } from "../../features/contact/contactSlice";
import { useSocket } from "../../context/SocketContext";

const VideoCall = () => {
  const { currentChat } = useSelector(useContact);
  const {
    callStatus,
    localStream,
    remoteStream,
    isMuted,
    isVideoOff,
    endCall,
    toggleMute,
    toggleVideo,
    localVideoRef,
    remoteVideoRef,
  } = useSocket();

  // Attach local/remote stream to video elements
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, localVideoRef]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, remoteVideoRef]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Call header */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={currentChat.picture}
              alt={currentChat.name}
              className="w-10 h-10 rounded-full"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-gray-100 dark:border-gray-800"></span>
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{currentChat.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {callStatus === "connecting" && "Connecting..."}
              {callStatus === "ringing" && "Ringing..."}
              {callStatus === "ongoing" && "Call in progress"}
              {callStatus === "ended" && "Call ended"}
            </p>
          </div>
        </div>
        <button 
          onClick={endCall} 
          className="p-2 rounded-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Video area */}
      <div className="flex-1 relative overflow-hidden bg-gray-200 dark:bg-gray-800">
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <Video className="h-10 w-10 text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">Waiting for {currentChat.name} to join...</p>
            </div>
          </div>
        )}

        {/* Local video preview */}
        {localStream && (
          <div className="absolute bottom-4 right-4 w-32 h-48 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 bg-black">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Call controls */}
      <div className="p-6 bg-gray-100 dark:bg-gray-800 flex justify-center space-x-8">
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full ${
            isMuted 
              ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700' 
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          } text-gray-800 dark:text-white transition-colors duration-200`}
        >
          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </button>
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full ${
            isVideoOff 
              ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700' 
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          } text-gray-800 dark:text-white transition-colors duration-200`}
        >
          {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
        </button>
        <button
          onClick={endCall}
          className="p-4 rounded-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white transition-colors duration-200"
        >
          <Phone className="h-6 w-6" />
        </button>
      </div>

      {/* Call status modal */}
      {callStatus === "ended" && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center">
            <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-gray-100">Call Ended</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Your video call with {currentChat.name} has ended</p>
            <button
              onClick={() => window.location.href = "/chat"}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 rounded-md text-white transition-colors duration-200"
            >
              Return to Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;