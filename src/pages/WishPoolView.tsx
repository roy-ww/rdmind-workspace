import { useState } from "react";
import { Star, Send, Sparkles, MessageSquare, ThumbsUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type FeedbackType = "feedback" | "wish";
type FilterType = "all" | "feedback" | "wish";

interface FeedbackItem {
  id: string;
  type: FeedbackType;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  liked: boolean;
}

const initialFeedbacks: FeedbackItem[] = [
  {
    id: "1",
    type: "wish",
    title: "支持多模态输入",
    content: "希望能支持图片、语音等多种输入方式，让 AI 交互更加自然便捷。",
    author: "探索者A",
    createdAt: "2026-02-14",
    likes: 12,
    liked: false,
  },
  {
    id: "2",
    type: "feedback",
    title: "排障助手非常好用",
    content: "排障助手帮我快速定位了服务器问题，节省了大量时间，希望能持续优化！",
    author: "运维小王",
    createdAt: "2026-02-13",
    likes: 8,
    liked: false,
  },
  {
    id: "3",
    type: "wish",
    title: "增加团队协作功能",
    content: "希望能支持多人协作编辑和共享会话，方便团队一起使用。",
    author: "团队领袖",
    createdAt: "2026-02-12",
    likes: 15,
    liked: false,
  },
  {
    id: "4",
    type: "feedback",
    title: "界面设计简洁美观",
    content: "整体 UI 风格很舒服，深色模式体验很好，建议增加更多主题色可选。",
    author: "设计师小李",
    createdAt: "2026-02-11",
    likes: 6,
    liked: false,
  },
  {
    id: "5",
    type: "wish",
    title: "自定义快捷指令",
    content: "希望可以自定义常用的 prompt 模板作为快捷指令，一键调用。",
    author: "效率达人",
    createdAt: "2026-02-10",
    likes: 20,
    liked: false,
  },
];

export function WishPoolView() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(initialFeedbacks);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<FeedbackType>("feedback");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const filtered = filter === "all" ? feedbacks : feedbacks.filter((f) => f.type === filter);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    const newItem: FeedbackItem = {
      id: Date.now().toString(),
      type: formType,
      title: title.trim(),
      content: content.trim(),
      author: "我",
      createdAt: new Date().toISOString().slice(0, 10),
      likes: 0,
      liked: false,
    };
    setFeedbacks([newItem, ...feedbacks]);
    setTitle("");
    setContent("");
    setShowForm(false);
  };

  const handleLike = (id: string) => {
    setFeedbacks((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, liked: !f.liked, likes: f.liked ? f.likes - 1 : f.likes + 1 }
          : f
      )
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-auto">
      <div className="w-full max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">星愿池</h1>
            <p className="text-xs text-muted-foreground">许下星愿，点亮未来 ✨</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="brand-gradient text-primary-foreground shadow-sm"
            size="sm"
          >
            <Send className="h-4 w-4" />
            提交反馈
          </Button>
        </div>

        {/* Submit Form */}
        {showForm && (
          <div className="rounded-xl border border-border bg-card p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">类型：</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setFormType("feedback")}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                    formType === "feedback"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  )}
                >
                  <MessageSquare className="h-3 w-3 inline mr-1" />
                  反馈
                </button>
                <button
                  onClick={() => setFormType("wish")}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                    formType === "wish"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  )}
                >
                  <Sparkles className="h-3 w-3 inline mr-1" />
                  许愿
                </button>
              </div>
            </div>
            <Input
              placeholder="标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm"
            />
            <Textarea
              placeholder={formType === "wish" ? "描述你期望的新功能..." : "分享你的使用感受或建议..."}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="text-sm min-h-[80px] resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                取消
              </Button>
              <Button size="sm" onClick={handleSubmit} disabled={!title.trim() || !content.trim()}>
                提交
              </Button>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          {(["all", "feedback", "wish"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                filter === f
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              {f === "all" ? "全部" : f === "feedback" ? "反馈" : "许愿"}
            </button>
          ))}
        </div>

        {/* Feedback List */}
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-card p-4 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    {item.type === "wish" ? (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px] px-1.5 py-0 gap-0.5">
                        <Sparkles className="h-2.5 w-2.5" />
                        许愿
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-0.5">
                        <MessageSquare className="h-2.5 w-2.5" />
                        反馈
                      </Badge>
                    )}
                    <h3 className="text-sm font-semibold text-foreground truncate">{item.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.content}</p>
                  <div className="flex items-center gap-3 mt-2.5 text-[11px] text-muted-foreground">
                    <span>{item.author}</span>
                    <span>·</span>
                    <span>{item.createdAt}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleLike(item.id)}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors shrink-0",
                    item.liked
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  <ThumbsUp className={cn("h-4 w-4", item.liked && "fill-current")} />
                  <span className="text-[10px] font-medium">{item.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
