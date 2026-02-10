import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Globe,
  ChevronDown,
  FileText,
  Database,
  Image,
  Link,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const models = [
  { id: "kimi-k2.5", label: "kimi-k2.5", desc: "高性能推理" },
  { id: "gpt-4o", label: "GPT-4o", desc: "多模态理解" },
  { id: "claude-3.5", label: "Claude 3.5", desc: "长文分析" },
  { id: "deepseek-v3", label: "DeepSeek V3", desc: "代码专家" },
  { id: "qwen-max", label: "Qwen-Max", desc: "中文优化" },
];

const mentionItems = [
  { id: "file", label: "文件", desc: "引用本地文件", icon: FileText },
  { id: "knowledge", label: "知识库", desc: "搜索知识库文档", icon: BookOpen },
  { id: "database", label: "数据库", desc: "查询数据源", icon: Database },
  { id: "image", label: "图片", desc: "引用图片资源", icon: Image },
  { id: "url", label: "网页链接", desc: "引用在线内容", icon: Link },
];

interface ChatInputProps {
  /** Compact mode for embedding in panels (hides model selector row icons) */
  compact?: boolean;
  /** Called when user sends a message */
  onSend?: (text: string) => void;
  /** Placeholder text */
  placeholder?: string;
}

export function ChatInput({ compact = false, onSend, placeholder }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showMention, setShowMention] = useState(false);
  const [mentionStyle, setMentionStyle] = useState<React.CSSProperties>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const mentionMenuRef = useRef<HTMLDivElement>(null);

  const getCursorPixelPos = (textarea: HTMLTextAreaElement, pos: number) => {
    if (!mirrorRef.current) return { top: 0, left: 0 };
    const mirror = mirrorRef.current;
    const style = window.getComputedStyle(textarea);
    mirror.style.cssText = `
      position:absolute;visibility:hidden;white-space:pre-wrap;word-wrap:break-word;overflow:hidden;
      width:${style.width};font:${style.font};padding:${style.padding};border:${style.border};
      line-height:${style.lineHeight};letter-spacing:${style.letterSpacing};
    `;
    const textBefore = textarea.value.slice(0, pos);
    mirror.textContent = textBefore;
    const span = document.createElement("span");
    span.textContent = "|";
    mirror.appendChild(span);
    const top = span.offsetTop - textarea.scrollTop;
    const left = span.offsetLeft;
    mirror.textContent = "";
    return { top, left };
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1 && (lastAtIndex === 0 || textBeforeCursor[lastAtIndex - 1] === " ")) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
      if (!textAfterAt.includes(" ")) {
        const pos = getCursorPixelPos(e.target, lastAtIndex);
        const textareaRect = e.target.getBoundingClientRect();
        const menuW = 210;
        const menuH = 200;
        // Absolute screen position of cursor
        let screenX = textareaRect.left + pos.left;
        let screenY = textareaRect.top + pos.top + 24;
        // Clamp to viewport
        if (screenX + menuW > window.innerWidth) screenX = window.innerWidth - menuW - 8;
        if (screenX < 8) screenX = 8;
        if (screenY + menuH > window.innerHeight) screenY = textareaRect.top + pos.top - menuH - 4;
        if (screenY < 8) screenY = 8;
        setMentionStyle({ position: 'fixed', top: screenY, left: screenX });
        setShowMention(true);
        return;
      }
    }
    setShowMention(false);
  };

  const handleSend = () => {
    const text = value.trim();
    if (!text) return;
    setValue("");
    onSend?.(text);
  };

  const insertMention = (item: (typeof mentionItems)[0]) => {
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = value.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    const newValue =
      value.slice(0, lastAtIndex) + `@${item.label} ` + value.slice(cursorPos);
    setValue(newValue);
    setShowMention(false);
    textareaRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowModelDropdown(false);
      setShowMention(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full", !compact && "max-w-2xl mx-auto")}>
      <div className="rounded-xl border border-border bg-card shadow-sm">
        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !showMention) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={placeholder || "输入指令，使用 @ 选择资源"}
            rows={compact ? 2 : 3}
            className="w-full resize-none border-0 bg-transparent px-4 pt-4 pb-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
          />

          {/* @ Mention Dropdown */}
          {showMention && (
            <div
              ref={mentionMenuRef}
              className="fixed z-[9999] bg-popover border border-border rounded-lg shadow-lg w-[210px] py-1 overflow-hidden"
              style={mentionStyle}
              onClick={(e) => e.stopPropagation()}
            >
              {mentionItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => insertMention(item)}
                  className="flex items-center gap-2.5 w-full px-3 py-1.5 text-sm hover:bg-accent transition-colors"
                >
                  <item.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground">{item.label}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{item.desc}</span>
                </button>
              ))}
            </div>
          )}
          <div ref={mirrorRef} aria-hidden="true" />
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            {/* Model Selector */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:bg-accent transition-colors"
              >
                <span>{selectedModel.label}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {showModelDropdown && (
                <div className="absolute bottom-full left-0 mb-1 z-50 bg-popover border border-border rounded-lg shadow-lg w-44 py-0.5">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model);
                        setShowModelDropdown(false);
                      }}
                      className={cn(
                        "flex items-center w-full px-3 py-1.5 text-xs hover:bg-accent transition-colors",
                        model.id === selectedModel.id && "text-primary bg-primary/5"
                      )}
                    >
                      <div>
                        <div className="font-medium">{model.label}</div>
                        <div className="text-[10px] text-muted-foreground">{model.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!compact && (
              <>
                <button className="p-1.5 rounded-md text-muted-foreground hover:bg-accent transition-colors">
                  <Paperclip className="h-4 w-4" />
                </button>
                <button className="p-1.5 rounded-md text-muted-foreground hover:bg-accent transition-colors">
                  <Globe className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          <button
            onClick={handleSend}
            className="p-2 rounded-lg brand-gradient text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
