import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardView } from "@/pages/DashboardView";
import { KnowledgeBaseView } from "@/pages/KnowledgeBaseView";
import { DevWorkbenchView } from "@/pages/DevWorkbenchView";
import { AIChatView } from "@/pages/AIChatView";
import { AIChatView2 } from "@/pages/AIChatView2";
import { SettingsView } from "@/pages/SettingsView";

const Index = () => {
  const [activeView, setActiveView] = useState("qa");

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="flex-1 flex min-h-0">
        {activeView === "qa" && <DashboardView />}
        {activeView === "chat" && <AIChatView />}
        {activeView === "chat2" && <AIChatView2 />}
        {activeView === "knowledge" && <KnowledgeBaseView />}
        {activeView === "dev" && <DevWorkbenchView />}
        {activeView === "settings" && <SettingsView />}
        {activeView !== "qa" && activeView !== "chat" && activeView !== "chat2" && activeView !== "knowledge" && activeView !== "dev" && activeView !== "settings" && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <h2 className="text-lg font-semibold text-foreground">即将推出</h2>
              <p className="text-sm text-muted-foreground">此功能正在开发中</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
