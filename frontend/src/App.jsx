import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import RegistrationPage from "./pages/auth/RegistrationPage";
import LoginPage from "./pages/auth/LoginPage";

import UserProfileSuccessPage from "./pages/auth/UserProfileSuccessPage";
import RouteGuard from "./RouteGuard";
import NotFoundPage from "./pages/404/NotFoundPage";
import Layout from "./pages/Layout";
import ChatArea from "./pages/chat/ChatArea";
import Audio from "./pages/audio/Audio";
import VideoCall from "./pages/video/VideoCall";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { SocketProvider } from "./context/SocketContext";

const App = () => {

  return (
    <SocketProvider>
      <Routes>
        {/* Guest-only group */}
        <Route element={<RouteGuard requireAuth={false} />}>
          <Route path="/" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/success" element={<UserProfileSuccessPage />} />
        </Route>

        {/* Authenticated-only group */}

        <Route element={<Layout />}>
          <Route element={<RouteGuard />}>

            <Route path="/chat" element={<ChatArea />} />
            <Route path="/video" element={<VideoCall />} />
            <Route path="/audio" element={<Audio />} />
          </Route>
        </Route>



        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </SocketProvider>
  );
};

export default App;
