import { useState } from "react";
import {
  FolderOpen,
  Brain,
  Bot,
  Puzzle,
  Plus,
  ChevronRight,
  ArrowLeft,
  X,
  Zap,
  FileText,
  Search,
  Globe,
  Moon,
  Sun,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

const LLM_OPTIONS = [
  { value: "gemini-3-flash", label: "Gemini 3 Flash" },
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "claude-sonnet-4", label: "Claude Sonnet 4" },
  { value: "deepseek-v3", label: "DeepSeek V3" },
  { value: "qwen-max", label: "Qwen Max" },
];

interface Skill {
  id: string;
  name: string;
  description: string;
  icon: "zap" | "file" | "search" | "globe";
  enabled: boolean;
}

const ICON_MAP = {
  zap: Zap,
  file: FileText,
  search: Search,
  globe: Globe,
};

const INITIAL_SKILLS: Skill[] = [
  { id: "1", name: "网页摘要", description: "自动提取并总结网页核心内容", icon: "globe", enabled: true },
  { id: "2", name: "文档解析", description: "解析 PDF、Word 等文档并提取关键信息", icon: "file", enabled: true },
  { id: "3", name: "智能搜索", description: "基于语义理解的深度知识检索", icon: "search", enabled: false },
];

type SettingsTab = "basic" | "skills";
type SkillSubView = "list" | "create" | "detail";

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("basic");

  // Basic settings state
  const [knowledgePath, setKnowledgePath] = useState("/data/knowledge");
  const [showThinking, setShowThinking] = useState(true);
  const [defaultModel, setDefaultModel] = useState("gemini-3-flash");
  const { theme, setTheme } = useTheme();

  // Skills state
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [skillSubView, setSkillSubView] = useState<SkillSubView>("list");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Create skill form
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState<Skill["icon"]>("zap");

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: "basic", label: "基础设置", icon: Bot },
    { id: "skills", label: "Skills 设置", icon: Puzzle },
  ];

  const handleCreateSkill = () => {
    if (!newName.trim()) return;
    const skill: Skill = {
      id: Date.now().toString(),
      name: newName.trim(),
      description: newDesc.trim(),
      icon: newIcon,
      enabled: true,
    };
    setSkills((prev) => [...prev, skill]);
    setNewName("");
    setNewDesc("");
    setNewIcon("zap");
    setSkillSubView("list");
  };

  const toggleSkill = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const openDetail = (skill: Skill) => {
    setSelectedSkill(skill);
    setSkillSubView("detail");
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-background">
      <div className="w-full max-w-3xl mx-auto px-6 py-10 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">设置</h1>
          <p className="text-sm text-muted-foreground mt-1">管理应用偏好和默认配置</p>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "skills") setSkillSubView("list");
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Basic Settings */}
        {activeTab === "basic" && (
          <div className="space-y-5">
            {/* Knowledge Directory */}
            <section className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FolderOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">知识目录</h2>
                  <p className="text-xs text-muted-foreground">设置本地知识库文件的存储路径</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  value={knowledgePath}
                  onChange={(e) => setKnowledgePath(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                  placeholder="/path/to/knowledge"
                />
                <button className="px-4 py-2.5 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition-colors whitespace-nowrap">
                  浏览…
                </button>
              </div>
            </section>

            {/* Thinking Process Toggle */}
            <section className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">展示思考过程</h2>
                    <p className="text-xs text-muted-foreground">在 AI 回复中显示推理和思考步骤</p>
                  </div>
                </div>
                <Switch checked={showThinking} onCheckedChange={setShowThinking} />
              </div>
            </section>

            {/* Default Model */}
            <section className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">默认大模型</h2>
                  <p className="text-xs text-muted-foreground">选择 AI 对话使用的默认语言模型</p>
                </div>
              </div>
              <Select value={defaultModel} onValueChange={setDefaultModel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent>
                  {LLM_OPTIONS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>

            <div className="flex justify-end">
              <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                保存设置
              </button>
            </div>
          </div>
        )}

        {/* Skills Settings */}
        {activeTab === "skills" && (
          <div>
            {/* Skills List */}
            {skillSubView === "list" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    已配置 {skills.length} 个 Skill
                  </p>
                  <button
                    onClick={() => setSkillSubView("create")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Plus className="h-4 w-4" />
                    创建 Skill
                  </button>
                </div>

                <div className="space-y-3">
                  {skills.map((skill) => {
                    const IconComp = ICON_MAP[skill.icon];
                    return (
                      <div
                        key={skill.id}
                        className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                          <IconComp className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground truncate">{skill.name}</h3>
                          <p className="text-xs text-muted-foreground truncate">{skill.description}</p>
                        </div>
                        <Switch
                          checked={skill.enabled}
                          onCheckedChange={() => toggleSkill(skill.id)}
                        />
                        <button
                          onClick={() => openDetail(skill)}
                          className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Create Skill */}
            {skillSubView === "create" && (
              <div className="space-y-5">
                <button
                  onClick={() => setSkillSubView("list")}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  返回列表
                </button>

                <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                  <h2 className="text-lg font-semibold text-foreground">创建新 Skill</h2>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">名称</label>
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="例如：网页摘要"
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">描述</label>
                    <textarea
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="描述这个 Skill 的功能和用途…"
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">图标</label>
                    <div className="flex gap-2">
                      {(Object.keys(ICON_MAP) as Skill["icon"][]).map((key) => {
                        const IC = ICON_MAP[key];
                        return (
                          <button
                            key={key}
                            onClick={() => setNewIcon(key)}
                            className={cn(
                              "p-3 rounded-lg border transition-colors",
                              newIcon === key
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-card text-muted-foreground hover:bg-accent"
                            )}
                          >
                            <IC className="h-5 w-5" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setSkillSubView("list")}
                      className="px-5 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleCreateSkill}
                      disabled={!newName.trim()}
                      className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      创建
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Skill Detail */}
            {skillSubView === "detail" && selectedSkill && (
              <div className="space-y-5">
                <button
                  onClick={() => setSkillSubView("list")}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  返回列表
                </button>

                <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      {(() => {
                        const IC = ICON_MAP[selectedSkill.icon];
                        return <IC className="h-6 w-6 text-primary" />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-foreground">{selectedSkill.name}</h2>
                      <p className="text-sm text-muted-foreground mt-1">{selectedSkill.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {selectedSkill.enabled ? "已启用" : "已禁用"}
                      </span>
                      <Switch
                        checked={selectedSkill.enabled}
                        onCheckedChange={() => {
                          toggleSkill(selectedSkill.id);
                          setSelectedSkill((s) =>
                            s ? { ...s, enabled: !s.enabled } : s
                          );
                        }}
                      />
                    </div>
                  </div>

                  <div className="border-t border-border pt-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-muted/40 p-4">
                        <p className="text-xs text-muted-foreground mb-1">Skill ID</p>
                        <p className="text-sm font-mono text-foreground">{selectedSkill.id}</p>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-4">
                        <p className="text-xs text-muted-foreground mb-1">状态</p>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 text-sm font-medium",
                            selectedSkill.enabled ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full",
                              selectedSkill.enabled ? "bg-primary" : "bg-muted-foreground/40"
                            )}
                          />
                          {selectedSkill.enabled ? "运行中" : "已停用"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => {
                        setSkills((prev) =>
                          prev.filter((s) => s.id !== selectedSkill.id)
                        );
                        setSkillSubView("list");
                      }}
                      className="px-5 py-2 rounded-lg border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors"
                    >
                      删除 Skill
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
