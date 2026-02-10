import { useState, useRef, useCallback, useEffect } from "react";
import { Settings, Trash2, Undo2, Redo2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface ExtractedParam {
  name: string;
}

function extractParams(text: string): ExtractedParam[] {
  const matches = text.match(/\{[^}]+\}/g);
  if (!matches) return [];
  const seen = new Set<string>();
  return matches
    .map((m) => m.slice(1, -1))
    .filter((name) => {
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    })
    .map((name) => ({ name }));
}

/** Render text with {param} highlighted */
function HighlightedText({ text }: { text: string }) {
  const parts = text.split(/(\{[^}]+\})/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("{") && part.endsWith("}")) {
          return (
            <span
              key={i}
              className="inline-block px-1 py-0.5 mx-0.5 rounded bg-primary/15 text-primary text-sm font-medium"
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

interface TemplateCreatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (template: { title: string; desc: string; prompt: string }) => void;
}

export function TemplateCreator({ open, onOpenChange, onCreated }: TemplateCreatorProps) {
  const [step, setStep] = useState(1);
  const [promptText, setPromptText] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<string[]>([""]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const historyTimer = useRef<ReturnType<typeof setTimeout>>();

  const params = extractParams(promptText);

  // Reset state on open
  useEffect(() => {
    if (open) {
      setStep(1);
      setPromptText("");
      setTitle("");
      setDesc("");
      setHistory([""]);
      setHistoryIdx(0);
    }
  }, [open]);

  const pushHistory = useCallback((text: string) => {
    setHistory((prev) => {
      const newH = prev.slice(0, historyIdx + 1);
      newH.push(text);
      return newH;
    });
    setHistoryIdx((prev) => prev + 1);
  }, [historyIdx]);

  const handleTextChange = useCallback((value: string) => {
    setPromptText(value);
    if (historyTimer.current) clearTimeout(historyTimer.current);
    historyTimer.current = setTimeout(() => pushHistory(value), 500);
  }, [pushHistory]);

  const handleUndo = useCallback(() => {
    if (historyIdx > 0) {
      const newIdx = historyIdx - 1;
      setHistoryIdx(newIdx);
      setPromptText(history[newIdx]);
    }
  }, [history, historyIdx]);

  const handleRedo = useCallback(() => {
    if (historyIdx < history.length - 1) {
      const newIdx = historyIdx + 1;
      setHistoryIdx(newIdx);
      setPromptText(history[newIdx]);
    }
  }, [history, historyIdx]);

  const insertParam = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = promptText.slice(start, end);
    const paramName = selected || "参数名";
    const newText = promptText.slice(0, start) + `{${paramName}}` + promptText.slice(end);
    handleTextChange(newText);
    setTimeout(() => {
      ta.focus();
      const pos = start + 1;
      ta.setSelectionRange(pos, pos + paramName.length);
    }, 0);
  }, [promptText, handleTextChange]);

  const deleteParam = useCallback((paramName: string) => {
    const newText = promptText.replace(new RegExp(`\\{${paramName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}`, 'g'), paramName);
    handleTextChange(newText);
  }, [promptText, handleTextChange]);

  const handleNext = () => {
    if (step === 1) {
      // Auto-generate title/desc suggestion
      if (!title) {
        const first30 = promptText.slice(0, 30).replace(/\{[^}]*\}/g, '').trim();
        setTitle(first30 || "自定义模板");
      }
      setStep(2);
    }
  };

  const handleCreate = () => {
    onCreated?.({
      title: title || "自定义模板",
      desc: desc || "用户自定义模板",
      prompt: promptText,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[960px] p-0 gap-0 flex flex-col max-h-[85vh] [&>button:last-child]:hidden">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 py-4 border-b border-border shrink-0 relative">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              1
            </div>
            <span className={`text-sm font-medium ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
              编写需求指令与参数
            </span>
          </div>
          <div className="w-16 h-px bg-border" />
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
            <span className={`text-sm font-medium ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
              AI 生成基本信息
            </span>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-accent text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {step === 1 && (
          <>
            {/* Content */}
            <div className="flex-1 flex min-h-0 overflow-hidden">
              {/* Left: Editor */}
              <div className="flex-1 flex flex-col border-r border-border">
                <div className="px-6 pt-5 pb-3">
                  <h3 className="text-base font-bold text-foreground mb-1">编写需求指令</h3>
                  <p className="text-xs text-muted-foreground">
                    在下方编辑模板内容，使用{" "}
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-xs font-bold">{"{}"}</span>
                    {" "}标记参数信息，或手动划词添加参数
                  </p>
                </div>
                <div className="flex-1 px-6 pb-2 min-h-0 flex flex-col">
                  <div className="flex-1 relative rounded-lg border border-border bg-card overflow-hidden flex flex-col">
                    {/* WYSIWYG editor with highlight overlay */}
                    <div className="flex-1 relative min-h-[200px]">
                      {/* Highlight layer (behind) */}
                      <div
                        className="absolute inset-0 p-4 text-sm leading-relaxed whitespace-pre-wrap break-words font-mono pointer-events-none overflow-auto"
                        aria-hidden="true"
                      >
                        {promptText ? <HighlightedText text={promptText} /> : null}
                      </div>
                      {/* Transparent textarea (front) */}
                      <textarea
                        ref={textareaRef}
                        value={promptText}
                        onChange={(e) => handleTextChange(e.target.value)}
                        placeholder="在此输入模板内容，使用 {参数名} 标记可变参数..."
                        className="w-full h-full resize-none border-0 bg-transparent p-4 text-sm text-transparent caret-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 font-mono relative z-10"
                        style={{ caretColor: 'var(--foreground)' }}
                        maxLength={30000}
                      />
                    </div>
                    {/* Bottom bar */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-border/50 shrink-0">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleUndo}
                          disabled={historyIdx <= 0}
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:bg-accent disabled:opacity-30 transition-colors"
                        >
                          <Undo2 className="h-3 w-3" /> 撤回
                        </button>
                        <button
                          onClick={handleRedo}
                          disabled={historyIdx >= history.length - 1}
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:bg-accent disabled:opacity-30 transition-colors"
                        >
                          <Redo2 className="h-3 w-3" /> 重做
                        </button>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {promptText.length}/30000
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Params */}
              <div className="w-72 flex flex-col shrink-0 overflow-hidden">
                <div className="px-5 pt-5 pb-3">
                  <h3 className="text-base font-bold text-foreground mb-1">参数配置</h3>
                  <p className="text-xs text-muted-foreground">
                    管理模板中的参数，配置参数类型和选项
                  </p>
                </div>
                <div className="flex-1 px-5 pb-4 overflow-auto">
                  {params.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        在左侧编辑器中使用<br />
                        <span className="font-mono font-bold text-foreground">{"{参数名}"}</span>
                        <br />添加参数
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {params.map((param) => (
                        <div key={param.name} className="rounded-lg border border-border bg-card p-3">
                          <div className="flex items-center gap-1.5">
                            <input
                              readOnly
                              value={param.name}
                              className="flex-1 min-w-0 px-2.5 py-1.5 rounded-md border border-border bg-background text-sm text-foreground truncate"
                            />
                            <button className="shrink-0 p-1.5 rounded-md hover:bg-accent text-muted-foreground transition-colors">
                              <Settings className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => deleteParam(param.name)}
                              className="shrink-0 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1.5">
                            已选内容: <span className="font-mono text-foreground">{`{${param.name}}`}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex justify-end shrink-0">
              <button
                onClick={handleNext}
                disabled={!promptText.trim()}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                下一步
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex-1 px-6 py-6 overflow-auto">
              <div className="max-w-lg mx-auto space-y-5">
                <div>
                  <h3 className="text-base font-bold text-foreground mb-3">完善模板信息</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    以下信息已由 AI 初步生成，您可以修改调整
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">模板名称</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="输入模板名称"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">模板描述</label>
                    <textarea
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="简要描述模板用途..."
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">指令预览</label>
                    <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                      <HighlightedText text={promptText} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex items-center justify-between shrink-0">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                上一步
              </button>
              <button
                onClick={handleCreate}
                disabled={!title.trim()}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                创建模板
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
