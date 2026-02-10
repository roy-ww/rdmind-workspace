import { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import {
  Send,
  Square,
  Loader2,
  Paperclip,
  Globe,
  ChevronDown,
  ChevronRight,
  FileText,
  Database,
  Image,
  Link,
  BookOpen,
  FileJson,
  FileCode,
} from "lucide-react";
import { cn } from "@/lib/utils";

const models = [
  { id: "kimi-k2.5", label: "kimi-k2.5", desc: "高性能推理" },
  { id: "gpt-4o", label: "GPT-4o", desc: "多模态理解" },
  { id: "claude-3.5", label: "Claude 3.5", desc: "长文分析" },
  { id: "deepseek-v3", label: "DeepSeek V3", desc: "代码专家" },
  { id: "qwen-max", label: "Qwen-Max", desc: "中文优化" },
];

interface FileItem {
  id: string;
  label: string;
  icon: typeof FileJson;
}

const fileSubItems: FileItem[] = [
  { id: "abc_123.json", label: "abc_123.json", icon: FileJson },
  { id: "xzy_123.md", label: "xzy_123.md", icon: FileCode },
];

interface MentionItem {
  id: string;
  label: string;
  desc: string;
  icon: typeof FileText;
  hasSubmenu?: boolean;
}

const mentionItems: MentionItem[] = [
  { id: "file", label: "文件", desc: "引用本地文件", icon: FileText, hasSubmenu: true },
  { id: "knowledge", label: "知识库", desc: "搜索知识库文档", icon: BookOpen },
  { id: "database", label: "数据库", desc: "查询数据源", icon: Database },
  { id: "image", label: "图片", desc: "引用图片资源", icon: Image },
  { id: "url", label: "网页链接", desc: "引用在线内容", icon: Link },
];

export interface SelectedMention {
  type: string;
  label: string;
  fileId?: string;
}

const CHIP_ATTR = "data-mention-chip";
const PLACEHOLDER_ATTR = "data-template-placeholder";
const DROPDOWN_ATTR = "data-template-dropdown";

function createPlaceholderElement(text: string): HTMLSpanElement {
  const wrapper = document.createElement("span");
  wrapper.setAttribute(PLACEHOLDER_ATTR, "true");
  wrapper.className =
    "inline-flex items-center relative mx-0.5 align-middle";

  const editable = document.createElement("span");
  editable.contentEditable = "true";
  editable.className =
    "inline-block px-2 py-0.5 rounded-md border border-dashed border-muted-foreground/40 text-sm text-foreground outline-none focus:border-primary/50 focus:bg-primary/5 transition-colors empty:text-transparent";
  // Use a width that matches the placeholder text length so the box is properly sized
  const charWidth = 14;
  editable.style.minWidth = `${Math.max(text.length * charWidth + 16, 40)}px`;
  editable.style.minHeight = "1.75em";
  editable.style.lineHeight = "1.75em";

  const placeholderEl = document.createElement("span");
  placeholderEl.className =
    "absolute left-2 top-0 bottom-0 flex items-center text-sm text-muted-foreground/50 pointer-events-none select-none whitespace-nowrap";
  placeholderEl.textContent = text;
  placeholderEl.setAttribute("data-placeholder-text", "true");

  wrapper.appendChild(editable);
  wrapper.appendChild(placeholderEl);

  // Hide placeholder when content exists - use multiple strategies for reliability
  const updatePlaceholder = () => {
    const hasContent = !!(editable.textContent && editable.textContent.trim());
    placeholderEl.style.display = hasContent ? "none" : "";
  };

  editable.addEventListener("input", updatePlaceholder);
  editable.addEventListener("keyup", updatePlaceholder);
  editable.addEventListener("keydown", () => {
    // Defer to catch the keystroke result
    requestAnimationFrame(updatePlaceholder);
  });
  editable.addEventListener("paste", () => {
    requestAnimationFrame(updatePlaceholder);
  });

  // MutationObserver as fallback for contentEditable quirks
  const observer = new MutationObserver(updatePlaceholder);
  observer.observe(editable, { childList: true, characterData: true, subtree: true });

  return wrapper;
}

function createDropdownElement(defaultVal: string, options: string[]): HTMLSpanElement {
  const wrapper = document.createElement("span");
  wrapper.className =
    "inline-flex items-center relative mx-0.5 rounded-md border border-solid border-primary/30 bg-primary/5 align-middle cursor-pointer hover:bg-primary/10 transition-colors";
  wrapper.contentEditable = "false";

  const select = document.createElement("select");
  select.setAttribute(DROPDOWN_ATTR, "true");
  select.contentEditable = "false";
  select.className =
    "appearance-none bg-transparent pl-2 pr-5 py-0.5 text-sm text-primary font-medium outline-none cursor-pointer";
  options.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    if (opt === defaultVal) option.selected = true;
    select.appendChild(option);
  });

  // Chevron icon
  const chevron = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  chevron.setAttribute("width", "12");
  chevron.setAttribute("height", "12");
  chevron.setAttribute("viewBox", "0 0 24 24");
  chevron.setAttribute("fill", "none");
  chevron.setAttribute("stroke", "currentColor");
  chevron.setAttribute("stroke-width", "2");
  chevron.setAttribute("stroke-linecap", "round");
  chevron.setAttribute("stroke-linejoin", "round");
  chevron.classList.add("absolute", "right-1", "top-1/2", "pointer-events-none");
  chevron.style.transform = "translateY(-50%)";
  chevron.style.color = "hsl(var(--primary) / 0.5)";
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "m6 9 6 6 6-6");
  chevron.appendChild(path);

  wrapper.appendChild(select);
  wrapper.appendChild(chevron);

  return wrapper;
}

function createChipElement(label: string, type: string, fileId?: string): HTMLSpanElement {
  const chip = document.createElement("span");
  chip.setAttribute(CHIP_ATTR, "true");
  chip.setAttribute("data-mention-type", type);
  if (fileId) chip.setAttribute("data-mention-file-id", fileId);
  chip.contentEditable = "false";
  chip.className =
    "inline-flex items-center gap-1 px-2 py-0.5 mx-0.5 rounded-md bg-primary/10 border border-primary/20 text-xs font-medium text-primary align-middle select-none";
  
  // Icon
  const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  iconSvg.setAttribute("width", "12");
  iconSvg.setAttribute("height", "12");
  iconSvg.setAttribute("viewBox", "0 0 24 24");
  iconSvg.setAttribute("fill", "none");
  iconSvg.setAttribute("stroke", "currentColor");
  iconSvg.setAttribute("stroke-width", "2");
  iconSvg.setAttribute("stroke-linecap", "round");
  iconSvg.setAttribute("stroke-linejoin", "round");
  iconSvg.classList.add("shrink-0");
  // Simple file icon path
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z");
  const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  polyline.setAttribute("points", "14 2 14 8 20 8");
  iconSvg.appendChild(path);
  iconSvg.appendChild(polyline);
  chip.appendChild(iconSvg);

  const text = document.createTextNode(label);
  chip.appendChild(text);

  return chip;
}

function getTextContent(el: HTMLDivElement): string {
  let text = "";
  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent || "";
    } else if (node instanceof HTMLElement && node.hasAttribute(CHIP_ATTR)) {
      // Skip chips for text extraction
    } else if (node instanceof HTMLBRElement) {
      text += "\n";
    }
  });
  return text;
}

function getMentions(el: HTMLDivElement): SelectedMention[] {
  const mentions: SelectedMention[] = [];
  el.querySelectorAll(`[${CHIP_ATTR}]`).forEach((chip) => {
    mentions.push({
      type: chip.getAttribute("data-mention-type") || "file",
      label: chip.textContent || "",
      fileId: chip.getAttribute("data-mention-file-id") || undefined,
    });
  });
  return mentions;
}

/** Check if text contains template variable syntax */
function hasTemplateVars(text: string): boolean {
  return /\{[^}]+\}|\[[^\]]+\]/.test(text);
}

/** Parse template text and return DOM fragment with special elements */
function parseTemplateToFragment(text: string): DocumentFragment {
  const frag = document.createDocumentFragment();
  const parts = text.split(/(\{[^}]+\}|\[[^\]]+\])/g);
  parts.forEach((part) => {
    if (part.startsWith("{") && part.endsWith("}")) {
      frag.appendChild(createPlaceholderElement(part.slice(1, -1)));
    } else if (part.startsWith("[") && part.endsWith("]")) {
      const inner = part.slice(1, -1);
      const [defaultVal, optionsStr] = inner.split("|");
      const options = optionsStr ? optionsStr.split(",") : [defaultVal];
      frag.appendChild(createDropdownElement(defaultVal.trim(), options.map(o => o.trim())));
    } else if (part) {
      frag.appendChild(document.createTextNode(part));
    }
  });
  return frag;
}

export interface ChatInputHandle {
  setContent: (text: string) => void;
  setTemplateContent: (templateName: string, prompt: string) => void;
}

interface ChatInputProps {
  compact?: boolean;
  onSend?: (text: string, mentions?: SelectedMention[]) => void;
  placeholder?: string;
  isLoading?: boolean;
  onStop?: () => void;
}

export const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(function ChatInput({ compact = false, onSend, placeholder, isLoading, onStop }, ref) {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showMention, setShowMention] = useState(false);
  const [showFileSubmenu, setShowFileSubmenu] = useState(false);
  const [mentionStyle, setMentionStyle] = useState<React.CSSProperties>({});
  const [isEmpty, setIsEmpty] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fillEditorWithTemplate = useCallback((prompt: string) => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = "";
    editorRef.current.appendChild(parseTemplateToFragment(prompt));
    setIsEmpty(false);
    editorRef.current.focus();
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    const text = e.clipboardData.getData("text/plain");
    if (text && hasTemplateVars(text)) {
      e.preventDefault();
      if (!editorRef.current) return;
      // Insert parsed template at cursor position
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const frag = parseTemplateToFragment(text);
        range.insertNode(frag);
        // Move cursor to end of inserted content
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        editorRef.current.appendChild(parseTemplateToFragment(text));
      }
      setIsEmpty(false);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    setContent: (text: string) => {
      if (!editorRef.current) return;
      editorRef.current.textContent = text;
      setIsEmpty(!text.trim());
      setActiveTemplate(null);
      const sel = window.getSelection();
      if (sel) {
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      editorRef.current.focus();
    },
    setTemplateContent: (templateName: string, prompt: string) => {
      setActiveTemplate(templateName);
      fillEditorWithTemplate(prompt);
    },
  }), [fillEditorWithTemplate]);

  const checkEmpty = useCallback(() => {
    if (!editorRef.current) return;
    const text = getTextContent(editorRef.current).trim();
    const hasChips = editorRef.current.querySelector(`[${CHIP_ATTR}]`) !== null;
    setIsEmpty(!text && !hasChips);
  }, []);

  const showMentionMenu = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const menuW = 210;
    const menuH = 200;
    let screenX = rect.left;
    let screenY = rect.bottom + 4;
    if (screenX + menuW > window.innerWidth) screenX = window.innerWidth - menuW - 8;
    if (screenX < 8) screenX = 8;
    if (screenY + menuH > window.innerHeight) screenY = rect.top - menuH - 4;
    if (screenY < 8) screenY = 8;
    setMentionStyle({ position: "fixed", top: screenY, left: screenX });
    setShowMention(true);
    setShowFileSubmenu(false);
  }, []);

  const handleEditorInput = useCallback(() => {
    checkEmpty();
    // Detect @ trigger
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const node = range.startContainer;
    if (node.nodeType !== Node.TEXT_NODE) return;
    const text = node.textContent || "";
    const offset = range.startOffset;
    const textBefore = text.slice(0, offset);
    const lastAt = textBefore.lastIndexOf("@");
    if (lastAt !== -1 && (lastAt === 0 || textBefore[lastAt - 1] === " ")) {
      const afterAt = textBefore.slice(lastAt + 1);
      if (!afterAt.includes(" ")) {
        showMentionMenu();
        return;
      }
    }
    setShowMention(false);
    setShowFileSubmenu(false);
  }, [checkEmpty, showMentionMenu]);

  const removeAtBeforeCursor = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const node = range.startContainer;
    if (node.nodeType !== Node.TEXT_NODE) return;
    const text = node.textContent || "";
    const offset = range.startOffset;
    const textBefore = text.slice(0, offset);
    const lastAt = textBefore.lastIndexOf("@");
    if (lastAt !== -1) {
      // Remove from @ to cursor
      node.textContent = text.slice(0, lastAt) + text.slice(offset);
      // Restore cursor
      const newRange = document.createRange();
      newRange.setStart(node, lastAt);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
  }, []);

  const insertChipAtCursor = useCallback(
    (label: string, type: string, fileId?: string) => {
      if (!editorRef.current) return;
      editorRef.current.focus();
      removeAtBeforeCursor();

      const chip = createChipElement(label, type, fileId);
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(chip);

      // Add a space after chip and move cursor there
      const space = document.createTextNode("\u00A0");
      chip.after(space);
      const newRange = document.createRange();
      newRange.setStartAfter(space);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);

      checkEmpty();
    },
    [removeAtBeforeCursor, checkEmpty]
  );

  const handleMentionClick = useCallback(
    (item: MentionItem) => {
      if (item.hasSubmenu) {
        setShowFileSubmenu(true);
        return;
      }
      insertChipAtCursor(item.label, item.id);
      setShowMention(false);
      setShowFileSubmenu(false);
    },
    [insertChipAtCursor]
  );

  const handleFileSelect = useCallback(
    (file: FileItem) => {
      insertChipAtCursor(file.label, "file", file.id);
      setShowMention(false);
      setShowFileSubmenu(false);
    },
    [insertChipAtCursor]
  );

  const handleSend = useCallback(() => {
    if (!editorRef.current) return;
    const text = getTextContent(editorRef.current).trim();
    const mentions = getMentions(editorRef.current);
    if (!text && mentions.length === 0) return;
    editorRef.current.innerHTML = "";
    setIsEmpty(true);
    onSend?.(text, mentions);
  }, [onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !showMention) {
        e.preventDefault();
        handleSend();
        return;
      }
      // Backspace: delete chip if cursor is right after one
      if (e.key === "Backspace") {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const range = sel.getRangeAt(0);
        if (!range.collapsed) return;

        const node = range.startContainer;
        const offset = range.startOffset;

        // Case 1: cursor in a text node at position 0, previous sibling is a chip
        if (node.nodeType === Node.TEXT_NODE && offset === 0) {
          const prev = node.previousSibling;
          if (prev instanceof HTMLElement && prev.hasAttribute(CHIP_ATTR)) {
            e.preventDefault();
            prev.remove();
            checkEmpty();
            return;
          }
        }

        // Case 2: cursor in the editor div itself, previous child is a chip
        if (node === editorRef.current && offset > 0) {
          const child = node.childNodes[offset - 1];
          if (child instanceof HTMLElement && child.hasAttribute(CHIP_ATTR)) {
            e.preventDefault();
            child.remove();
            checkEmpty();
            return;
          }
        }
      }
    },
    [showMention, handleSend, checkEmpty]
  );

  useEffect(() => {
    const handleClickOutside = () => {
      setShowModelDropdown(false);
      setShowMention(false);
      setShowFileSubmenu(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full", !compact && "max-w-2xl mx-auto")}>
      <div className="rounded-xl border border-border bg-card shadow-sm">
        {/* Active template banner */}
        {activeTemplate && (
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border-b border-primary/10 rounded-t-xl">
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span className="text-sm font-medium text-primary">{activeTemplate}</span>
            <button
              onClick={() => {
                setActiveTemplate(null);
                if (editorRef.current) {
                  editorRef.current.innerHTML = "";
                  setIsEmpty(true);
                }
              }}
              className="ml-1 text-primary/60 hover:text-primary transition-colors"
            >
              <span className="text-sm">×</span>
            </button>
          </div>
        )}
        {/* Editable area */}
        <div className="relative">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleEditorInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            className={cn(
              "w-full border-0 bg-transparent px-4 pt-4 pb-2 text-sm text-foreground focus:outline-none focus:ring-0",
              compact ? "min-h-[3.5rem]" : "min-h-[5rem]",
              "whitespace-pre-wrap break-words"
            )}
            style={{ overflowWrap: "break-word" }}
          />
          {/* Placeholder */}
          {isEmpty && (
            <div className="absolute left-4 top-4 text-sm text-muted-foreground pointer-events-none select-none">
              {placeholder || "输入指令，使用 @ 选择资源"}
            </div>
          )}

          {/* @ Mention Dropdown */}
          {showMention && (
            <div
              className="fixed z-[9999] bg-popover border border-border rounded-lg shadow-lg w-[210px] py-1"
              style={mentionStyle}
              onClick={(e) => e.stopPropagation()}
            >
              {mentionItems.map((item) => (
                <button
                  key={item.id}
                  onMouseEnter={() => {
                    if (item.hasSubmenu) setShowFileSubmenu(true);
                    else setShowFileSubmenu(false);
                  }}
                  onClick={() => handleMentionClick(item)}
                  className={cn(
                    "flex items-center gap-2.5 w-full px-3 py-1.5 text-sm hover:bg-accent transition-colors",
                    item.hasSubmenu && showFileSubmenu && "bg-accent"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground">{item.label}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {item.hasSubmenu ? (
                      <ChevronRight className="h-3 w-3" />
                    ) : (
                      item.desc
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* File Submenu */}
          {showMention && showFileSubmenu && (
            <div
              className="fixed z-[10000] bg-popover border border-border rounded-lg shadow-lg w-[200px] py-1"
              style={{
                top: mentionStyle.top,
                left:
                  typeof mentionStyle.left === "number"
                    ? mentionStyle.left + 214
                    : mentionStyle.left,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                选择文件
              </div>
              {fileSubItems.map((file) => (
                <button
                  key={file.id}
                  onClick={() => handleFileSelect(file)}
                  className="flex items-center gap-2.5 w-full px-3 py-1.5 text-sm hover:bg-accent transition-colors"
                >
                  <file.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground">{file.label}</span>
                </button>
              ))}
            </div>
          )}
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

          {isLoading ? (
            <button
              onClick={onStop}
              className="p-2 rounded-lg bg-destructive text-destructive-foreground shadow-sm hover:opacity-90 transition-opacity"
              title="终止回复"
            >
              <Square className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              className="p-2 rounded-lg brand-gradient text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});