import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute.jsx'
import AppShell from '../components/common/AppShell.jsx'

import LandingPage from '../pages/LandingPage.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import RegisterPage from '../pages/auth/RegisterPage.jsx'
import VerifyEmailPage from '../pages/auth/VerifyEmailPage.jsx'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx'
import DashboardPage from '../pages/dashboard/DashboardPage.jsx'
import UpcomingMeetingsPage from '../pages/meetings/UpcomingMeetingsPage.jsx'
import PreviousMeetingsPage from '../pages/meetings/PreviousMeetingsPage.jsx'
import ScheduleMeetingPage from '../pages/meetings/ScheduleMeetingPage.jsx'
import JoinMeetingPage from '../pages/meetings/JoinMeetingPage.jsx'
import MeetingRoomPage from '../pages/meetings/MeetingRoomPage.jsx'
import NotesPage from '../pages/notes/NotesPage.jsx'
import SettingsPage from '../pages/settings/SettingsPage.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="/join" element={<JoinMeetingPage />} />
      <Route path="/meeting/:meetingId" element={<MeetingRoomPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/upcoming" element={<UpcomingMeetingsPage />} />
          <Route path="/previous" element={<PreviousMeetingsPage />} />
          <Route path="/schedule" element={<ScheduleMeetingPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
