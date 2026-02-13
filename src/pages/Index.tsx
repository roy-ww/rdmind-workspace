import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardView } from "@/pages/DashboardView";
import { KnowledgeBaseView } from "@/pages/KnowledgeBaseView";
import { DevWorkbenchView } from "@/pages/DevWorkbenchView";
import { AIChatView } from "@/pages/AIChatView";
import { AIChatView2 } from "@/pages/AIChatView2";
import { ChatEditorView } from "@/pages/ChatEditorView";
import { SettingsView } from "@/pages/SettingsView";
import { ProfileView } from "@/pages/ProfileView";

const Index = () => {
  const [activeView, setActiveView] = useState("qa");

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <AppSidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="flex-1 flex min-h-0">
        {activeView === "qa" && <DashboardView />}
        {activeView === "chat" && <AIChatView />}
        {activeView === "chat2" && <AIChatView2 />}
        {activeView === "chatEditor" && <ChatEditorView />}
        {activeView === "knowledge" && <KnowledgeBaseView />}
        {activeView === "dev" && <DevWorkbenchView />}
        {activeView === "settings" && <SettingsView />}
        {activeView === "profile" && <ProfileView />}
      </main>
    </div>
  );
};

export default Index;
