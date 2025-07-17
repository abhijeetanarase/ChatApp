import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  // --- States ---
  const [callStatus, setCallStatus] = useState("idle"); // idle, ringing, ongoing, ended
  const [incomingCall, setIncomingCall] = useState(null); // { fromUserId, offer, callerInfo }
  const [outgoingCall, setOutgoingCall] = useState(null); // { toUserId, offer }
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const peerConnection = useRef(null);
  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const ringingTimeoutRef = useRef(null);

  // IDs
  const currentUserId = localStorage.getItem("userId");

  // --- Socket Setup ---
  useEffect(() => {
    socketRef.current = io("http://localhost:4000", {
      auth: { token: localStorage.getItem("authToken") },
    });

    // Offer event par sirf ringing
    socketRef.current.on("offer", ({ offer, fromUserId, callerInfo, sentAt }) => {
      console.log("[RECEIVER] Received offer at", Date.now(), "Offer sent at:", sentAt, "Latency:", Date.now() - (sentAt || 0), "ms");
      setIncomingCall({ fromUserId, offer, callerInfo });
      setCallStatus("ringing"); // ✅ sirf ringing
      // 45 seconds ringing timeout
      if (ringingTimeoutRef.current) clearTimeout(ringingTimeoutRef.current);
      ringingTimeoutRef.current = setTimeout(() => {
        setCallStatus((prev) => (prev === "ringing" ? "ended" : prev));
        setIncomingCall(null);
      }, 45000);
    });

    // Answer received (for outgoing call)
    socketRef.current.on("answer", async ({ answer, fromUserId }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(answer);
        setCallStatus("ongoing"); // ✅ caller side par answer milne par
      }
      // Jab bhi call accept ho ya end ho, ringing timeout clear karo
      if (ringingTimeoutRef.current) clearTimeout(ringingTimeoutRef.current);
    });

    // ICE candidate
    socketRef.current.on("ice-candidate", async ({ candidate }) => {
      try {
        await peerConnection.current?.addIceCandidate(candidate);
      } catch (err) {
        console.error("Error adding ICE candidate", err);
      }
    });

    // Call ended
    socketRef.current.on("call-ended", () => {
      setCallStatus("ended");
      setIncomingCall(null);
      setOutgoingCall(null);
      cleanupStreams();
      if (ringingTimeoutRef.current) clearTimeout(ringingTimeoutRef.current);
    });

    // Call rejected
    socketRef.current.on("call-rejected", () => {
      setCallStatus("idle");
      setOutgoingCall(null);
      cleanupStreams();
      if (ringingTimeoutRef.current) clearTimeout(ringingTimeoutRef.current);
    });

    return () => {
      socketRef.current?.disconnect();
      if (ringingTimeoutRef.current) clearTimeout(ringingTimeoutRef.current);
    };
  }, []);

 
 
  // --- Media Setup ---
  useEffect(() => {
    // Caller: outgoingCall hai to media chalu karo
    if (outgoingCall && !localStream) {
      initMedia();
    }
    // Receiver: sirf accept par media chalu karo (callStatus === 'ongoing' aur localStream nahi hai)
    else if (callStatus === "ongoing" && incomingCall && !localStream) {
      initMedia();
    }
    // eslint-disable-next-line
  }, [outgoingCall, callStatus, incomingCall]);

  const initMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    
      
      setLocalStream(stream);
    } catch (err) {
      console.error("Failed to get local stream", err);
    }
  };

  // --- Attach local stream to video element ---
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // --- Peer Connection Setup ---
  useEffect(() => {
    // Caller: outgoingCall hai to peer connection setup karo
    if (localStream && outgoingCall) {
      setupPeerConnection(false);
    }
    // Receiver: sirf tab setup karo jab callStatus === 'ongoing' (user ne accept kiya)
    else if (localStream && callStatus === "ongoing" && incomingCall) {
      setupPeerConnection(true);
    }
    // eslint-disable-next-line
  }, [localStream, outgoingCall, callStatus, incomingCall]);

  const setupPeerConnection = async (isAnswering) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnection.current = pc;

    // Add local tracks
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    // Remote stream handler
    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    // ICE candidate handler
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const toUserId = isAnswering ? incomingCall.fromUserId : outgoingCall.toUserId;
        socketRef.current.emit("ice-candidate", {
          toUserId,
          fromUserId: currentUserId,
          candidate: event.candidate,
        });
      }
    };

    if (isAnswering) {
      // Set remote offer, create answer
      await pc.setRemoteDescription(incomingCall.offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketRef.current.emit("answer", {
        toUserId: incomingCall.fromUserId,
        fromUserId: currentUserId,
        answer,
      });
      setCallStatus("ongoing");
    } else {
      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      // Timing log: Caller emits offer
      console.log("[CALLER] Emitting offer at", Date.now());
      socketRef.current.emit("offer", {
        toUserId: outgoingCall.toUserId,
        fromUserId: currentUserId,
        offer,
        callerInfo: outgoingCall.callerInfo,
        sentAt: Date.now(), // timing info
      });
      setCallStatus("ringing");
    }
  };

  // --- Call Actions ---
  const startCall = async (toUserId, callerInfo) => {
    setOutgoingCall({ toUserId, callerInfo });
    setCallStatus("ringing");
    await initMedia();
    // Peer connection setup will be triggered by useEffect
  };

  const acceptCall = async () => {
    setCallStatus("ongoing"); // ✅ sirf accept par
    // ab media chalu hogi, peer connection setup useEffect se trigger hoga
  };

  const rejectCall = () => {
    if (incomingCall) {
      socketRef.current.emit("reject-call", { toUserId: incomingCall.fromUserId });
    }
    setCallStatus("idle");
    setIncomingCall(null);
    cleanupStreams();
  };

  const endCall = () => {
    if (outgoingCall) {
      socketRef.current.emit("end-call", {
        toUserId: outgoingCall.toUserId,
        fromUserId: currentUserId,
      });
    } else if (incomingCall) {
      socketRef.current.emit("end-call", {
        toUserId: incomingCall.fromUserId,
        fromUserId: currentUserId,
      });
    }
    setCallStatus("ended");
    setIncomingCall(null);
    setOutgoingCall(null);
    cleanupStreams();
    peerConnection.current?.close();
  };

  // --- Media Controls ---
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  // --- Cleanup ---
  const cleanupStreams = () => {
    if (localStream) localStream.getTracks().forEach(track => track.stop());
    setLocalStream(null);
    setRemoteStream(null);
    peerConnection.current?.close();
    peerConnection.current = null;
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        callStatus,
        incomingCall,
        outgoingCall,
        localStream,
        remoteStream,
        isMuted,
        isVideoOff,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleVideo,
        localVideoRef,
        remoteVideoRef,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}; 