import { useState } from "react";
import {
  Lightbulb,
  Briefcase,
  BookOpen,
  Code,
  GraduationCap,
  CheckCircle,
  Edit3,
  MoreVertical,
  Plus,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  Undo,
  Redo,
  Eraser,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface LabItem {
  id: string;
  name: string;
  description: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  badge?: string;
}

const presetLabs: LabItem[] = [
  {
    id: "1",
    name: "灵感源泉",
    description: "轻松获得海量灵感，包括派对活动、送礼、商务等方面的建议。",
    icon: Lightbulb,
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "2",
    name: "职业顾问",
    description: "解锁职业发展潜能，制定详尽的技能提升计划，实现职业发展目标。",
    icon: Briefcase,
    iconBg: "bg-rose-100 dark:bg-rose-900/30",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "3",
    name: "Storybook",
    description: "根据指定的主题、目标读者年龄和期望的图画风格，为大人或小孩创作专属...",
    icon: BookOpen,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    badge: "实验版",
  },
  {
    id: "4",
    name: "编码助手",
    description: "提升编码能力，获得构建项目所需的资源，边做边学。",
    icon: Code,
    iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    id: "5",
    name: "学习辅导",
    description: "告诉我你想学的内容，在我的帮助下掌握新概念、温习知识点。",
    icon: GraduationCap,
    iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "6",
    name: "效率规划",
    description: "安排任务、每日更新和每周总结，让你的工作井井有条。",
    icon: CheckCircle,
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "7",
    name: "文案编辑",
    description: "提升写作水准，在语法、句子结构等各方面获得一目了然的实用建议。",
    icon: Edit3,
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
  },
];

function LabGallery({ onCreateNew }: { onCreateNew: () => void }) {
  const [presetCollapsed, setPresetCollapsed] = useState(false);
  const [userLabs] = useState<LabItem[]>([]);

  return (
    <div className="flex-1 overflow-auto p-8 max-w-5xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-foreground mb-8">RDMind 实验室</h1>

      {/* Preset Labs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">预设实验室</span>
          <button
            onClick={() => setPresetCollapsed(!presetCollapsed)}
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            {presetCollapsed ? "展开" : "收起"}
            {presetCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
        {!presetCollapsed && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {presetLabs.map((lab) => (
              <div
                key={lab.id}
                className="group relative rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-full ${lab.iconBg} flex items-center justify-center`}>
                    <lab.icon className={`h-4 w-4 ${lab.iconColor}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {lab.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground">
                        {lab.badge}
                      </span>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-md hover:bg-accent text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>查看详情</DropdownMenuItem>
                        <DropdownMenuItem>复制</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-foreground mb-1">{lab.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{lab.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Labs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">我的实验室</span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>创建自定义实验室来定制 AI 的行为和能力</TooltipContent>
            </Tooltip>
          </div>
          <Button onClick={onCreateNew} className="brand-gradient text-primary-foreground gap-1.5">
            <Plus className="h-4 w-4" />
            新建实验室
          </Button>
        </div>
        {userLabs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 py-12 flex flex-col items-center justify-center">
            <Sparkles className="h-6 w-6 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">你创建的实验室会显示在这里</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* user labs would render here */}
          </div>
        )}
      </div>
    </div>
  );
}

const iconOptions = [
  { id: "lightbulb", icon: Lightbulb, bg: "bg-amber-100 dark:bg-amber-900/30", color: "text-amber-600 dark:text-amber-400" },
  { id: "briefcase", icon: Briefcase, bg: "bg-rose-100 dark:bg-rose-900/30", color: "text-rose-600 dark:text-rose-400" },
  { id: "book", icon: BookOpen, bg: "bg-blue-100 dark:bg-blue-900/30", color: "text-blue-600 dark:text-blue-400" },
  { id: "code", icon: Code, bg: "bg-cyan-100 dark:bg-cyan-900/30", color: "text-cyan-600 dark:text-cyan-400" },
  { id: "graduation", icon: GraduationCap, bg: "bg-indigo-100 dark:bg-indigo-900/30", color: "text-indigo-600 dark:text-indigo-400" },
  { id: "check", icon: CheckCircle, bg: "bg-purple-100 dark:bg-purple-900/30", color: "text-purple-600 dark:text-purple-400" },
  { id: "edit", icon: Edit3, bg: "bg-green-100 dark:bg-green-900/30", color: "text-green-600 dark:text-green-400" },
];

function LabCreateForm({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("我的实验室");
  const [description, setDescription] = useState("");
  const [instruction, setInstruction] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0]);

  return (
    <div className="flex-1 overflow-auto p-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className={`w-12 h-12 rounded-full ${selectedIcon.bg} flex items-center justify-center`}>
          <selectedIcon.icon className={`h-5 w-5 ${selectedIcon.color}`} />
        </div>
        <h1 className="text-xl font-bold text-foreground">{name || "我的实验室"}</h1>
      </div>

      {/* Icon Picker */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">图标</label>
        <div className="flex items-center gap-2">
          {iconOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedIcon(opt)}
              className={`w-10 h-10 rounded-full ${opt.bg} flex items-center justify-center transition-all ${
                selectedIcon.id === opt.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:opacity-80"
              }`}
            >
              <opt.icon className={`h-4 w-4 ${opt.color}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">名称</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="为你的实验室命名"
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">说明</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="介绍你的实验室并说明它的用途"
          rows={2}
        />
      </div>

      {/* Instruction */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-medium text-foreground">指令</label>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>定义 AI 在此实验室中的行为和角色</TooltipContent>
          </Tooltip>
        </div>
        <Textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="例如：你是一位园艺师，熟悉天然草坪和本土植物，可以帮助人们规划低耗水的庭园。你需要考虑地理位置、气候条件，以及当地的本土植物。你知识渊博、随和友好。"
          rows={5}
          className="bg-muted/50"
        />
      </div>

      {/* Knowledge */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-medium text-foreground">知识</label>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>添加文件供实验室在对话中参考</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
          <span className="text-sm text-muted-foreground">添加文件，供你的实验室在对话中参考。</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-md hover:bg-accent text-muted-foreground">
                <Plus className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Upload className="h-4 w-4 mr-2" />
                上传文件
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BookOpen className="h-4 w-4 mr-2" />
                在线文档
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onBack}>返回</Button>
        <Button className="brand-gradient text-primary-foreground">保存</Button>
      </div>
    </div>
  );
}

export function LabView() {
  const [view, setView] = useState<"gallery" | "create">("gallery");

  return (
    <div className="flex-1 flex min-h-0 h-screen">
      {view === "gallery" ? (
        <LabGallery onCreateNew={() => setView("create")} />
      ) : (
        <LabCreateForm onBack={() => setView("gallery")} />
      )}
    </div>
  );
}
