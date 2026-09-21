import { Navigate, Route, Routes } from "react-router-dom";
import { DemoShell } from "@/components/layout/DemoShell";
import { FlowDiagram } from "@/pages/FlowDiagram";
import { Overview } from "@/pages/Overview";
import { Traceability } from "@/pages/Traceability";
import { Blocked } from "@/pages/app/Blocked";
import { CaptureKtp } from "@/pages/app/CaptureKtp";
import { CaptureOnboarding } from "@/pages/app/CaptureOnboarding";
import { CaptureSelfie } from "@/pages/app/CaptureSelfie";
import { Dira } from "@/pages/app/Dira";
import { EddQuestionnaire } from "@/pages/app/EddQuestionnaire";
import { FaceRecognitionGate } from "@/pages/app/FaceRecognitionGate";
import { HelpArticle } from "@/pages/app/HelpArticle";
import { Home } from "@/pages/app/Home";
import { Notifications } from "@/pages/app/Notifications";
import { OddConfirm } from "@/pages/app/OddConfirm";
import { OutcomePending } from "@/pages/app/OutcomePending";
import { OutcomeRejected } from "@/pages/app/OutcomeRejected";
import { PhoneLayout } from "@/pages/app/PhoneLayout";
import { Processing } from "@/pages/app/Processing";
import { ReviewEktp } from "@/pages/app/ReviewEktp";
import { VerifiedAccountCenter } from "@/pages/app/VerifiedAccountCenter";
import { Wallet } from "@/pages/app/Wallet";
import { PartnerConsole } from "@/pages/partners/PartnerConsole";
import { Portal } from "@/pages/portal/Portal";
import { ScenarioConsole } from "@/pages/scenario/ScenarioConsole";

export function App() {
  return (
    <Routes>
      <Route element={<DemoShell />}>
        <Route index element={<Overview />} />
        <Route path="app" element={<PhoneLayout />}>
          <Route index element={<Home />} />
          <Route path="vac" element={<VerifiedAccountCenter />} />
          <Route path="dira" element={<Dira />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="blocked" element={<Blocked />} />
          <Route path="odd/confirm" element={<OddConfirm />} />
          <Route path="rekyc/review" element={<ReviewEktp />} />
          <Route path="rekyc/help/not-mine" element={<HelpArticle />} />
          <Route path="rekyc/fr" element={<FaceRecognitionGate />} />
          <Route path="rekyc/onboarding" element={<CaptureOnboarding />} />
          <Route path="rekyc/capture/ktp" element={<CaptureKtp />} />
          <Route path="rekyc/capture/selfie" element={<CaptureSelfie />} />
          <Route path="rekyc/processing" element={<Processing />} />
          <Route path="rekyc/edd" element={<EddQuestionnaire />} />
          <Route path="rekyc/result/pending" element={<OutcomePending />} />
          <Route path="rekyc/result/rejected" element={<OutcomeRejected />} />
        </Route>
        <Route path="portal" element={<Portal />} />
        <Route path="partners" element={<PartnerConsole />} />
        <Route path="scenario" element={<ScenarioConsole />} />
        <Route path="flow" element={<FlowDiagram />} />
        <Route path="traceability" element={<Traceability />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
