import { useState } from "react";
import { CloudSidebar } from "@/components/CloudSidebar";
import { CloudDashboardView } from "@/pages/CloudDashboardView";
import { DashboardView } from "@/pages/DashboardView";
import { KnowledgeBaseView } from "@/pages/KnowledgeBaseView";
import { DevWorkbenchView } from "@/pages/DevWorkbenchView";
import { ChatEditorView } from "@/pages/ChatEditorView";
import { TroubleshootView } from "@/pages/TroubleshootView";
import { LabView } from "@/pages/LabView";
import { SettingsView } from "@/pages/SettingsView";
import { WishPoolView } from "@/pages/WishPoolView";

const CloudPlatform = () => {
  const [activeView, setActiveView] = useState("home");

  return (
    <div className="cloud-theme flex h-screen w-full bg-background overflow-hidden">
      <CloudSidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="flex-1 flex min-h-0">
        {activeView === "home" && <CloudDashboardView />}
        {activeView === "qa" && <DashboardView />}
        {activeView === "chatEditor" && <ChatEditorView />}
        {activeView === "troubleshoot" && <TroubleshootView />}
        {activeView === "knowledge" && <KnowledgeBaseView />}
        {activeView === "lab" && <LabView />}
        {activeView === "dev" && <DevWorkbenchView />}
        {activeView === "wishpool" && <WishPoolView />}
        {activeView === "settings" && <SettingsView />}
      </main>
    </div>
  );
};

export default CloudPlatform;
