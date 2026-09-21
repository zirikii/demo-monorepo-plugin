import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { RekycProvider } from "@/hooks/useRekyc";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { LandingPage } from "@/pages/Landing";
import { LoginPage } from "@/pages/Login";
import { SignupPage } from "@/pages/Signup";
import { HomePage } from "@/pages/Home";
import { VacPage } from "@/pages/Vac";
import { RekycReviewPage } from "@/pages/RekycReview";
import { RekycFrPage } from "@/pages/RekycFr";
import { RekycOnboardingPage } from "@/pages/RekycOnboarding";
import { RekycCapturePage } from "@/pages/RekycCapture";
import { RekycEddPage } from "@/pages/RekycEdd";
import { RekycPendingPage, RekycRejectPage } from "@/pages/RekycResult";
import { DiraPage } from "@/pages/Dira";
import { HelpPage } from "@/pages/Help";
import { SettingsPage } from "@/pages/Settings";
import { NotificationsPage } from "@/pages/Notifications";
import { OddConfirmPage } from "@/pages/OddConfirm";
import { EmoneyPage } from "@/pages/Emoney";
import { CallbacksPage } from "@/pages/Callbacks";
import { NotFoundPage } from "@/pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <RekycProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/app" element={<HomePage />} />
            <Route path="/app/vac" element={<VacPage />} />
            <Route path="/app/rekyc" element={<RekycReviewPage />} />
            <Route path="/app/rekyc/fr" element={<RekycFrPage />} />
            <Route path="/app/rekyc/onboarding" element={<RekycOnboardingPage />} />
            <Route path="/app/rekyc/capture" element={<RekycCapturePage />} />
            <Route path="/app/rekyc/edd" element={<RekycEddPage />} />
            <Route path="/app/rekyc/reject" element={<RekycRejectPage />} />
            <Route path="/app/rekyc/pending" element={<RekycPendingPage />} />
            <Route path="/app/dira" element={<DiraPage />} />
            <Route path="/app/help/:slug" element={<HelpPage />} />
            <Route path="/app/settings" element={<SettingsPage />} />
            <Route path="/app/notifications" element={<NotificationsPage />} />
            <Route path="/app/odd" element={<OddConfirmPage />} />
            <Route path="/emoney" element={<EmoneyPage />} />
            <Route path="/emoney/callbacks" element={<CallbacksPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </RekycProvider>
    </AuthProvider>
  );
}
