import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface ParamConfig {
  key: string;
  placeholder: string;
  type: "text" | "select";
  options: string[];
}

interface ParamConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paramName: string;
  config?: ParamConfig;
  onConfirm: (config: ParamConfig) => void;
}

export function ParamConfigDialog({
  open,
  onOpenChange,
  paramName,
  config,
  onConfirm,
}: ParamConfigDialogProps) {
  const [key, setKey] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [type, setType] = useState<"text" | "select">("text");
  const [options, setOptions] = useState<string[]>([""]);

  useEffect(() => {
    if (open) {
      setKey(config?.key || paramName);
      setPlaceholder(config?.placeholder || paramName);
      setType(config?.type || "text");
      setOptions(config?.options?.length ? config.options : [""]);
    }
  }, [open, paramName, config]);

  const handleConfirm = () => {
    onConfirm({
      key,
      placeholder,
      type,
      options: type === "select" ? options.filter((o) => o.trim()) : [],
    });
    onOpenChange(false);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (idx: number) =>
    setOptions(options.filter((_, i) => i !== idx));
  const updateOption = (idx: number, val: string) =>
    setOptions(options.map((o, i) => (i === idx ? val : o)));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 flex flex-col [&>button:last-child]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">配置参数</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-md hover:bg-accent text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 flex-1 overflow-auto">
          {/* 参数标识 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              参数标识 (key)
            </label>
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="param_key"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* 占位符 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              占位符
            </label>
            <input
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="请输入占位符文字"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* 参数类型 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              参数类型
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setType("text")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  type === "text"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-accent"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    type === "text" ? "border-primary" : "border-muted-foreground/40"
                  }`}
                >
                  {type === "text" && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </span>
                文本输入
              </button>
              <button
                onClick={() => setType("select")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  type === "select"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-accent"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    type === "select" ? "border-primary" : "border-muted-foreground/40"
                  }`}
                >
                  {type === "select" && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </span>
                单选下拉
              </button>
            </div>
          </div>

          {/* 下拉选项 (仅 select 类型) */}
          {type === "select" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                下拉选项
              </label>
              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      value={opt}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      placeholder={`选项 ${idx + 1}`}
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    {options.length > 1 && (
                      <button
                        onClick={() => removeOption(idx)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addOption}
                  className="text-xs text-primary hover:underline"
                >
                  + 添加选项
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <button
            onClick={() => onOpenChange(false)}
            className="px-5 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            确认
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
