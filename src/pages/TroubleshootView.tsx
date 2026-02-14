import { useState, useEffect, useRef } from "react";
import { AIChat } from "@/components/AIChat";
import { ActionViewer, type ActionItem } from "@/components/ActionViewer";
import { ResourcePanel } from "@/components/ResourcePanel";

const demoActions: ActionItem[] = [
  {
    id: "1",
    type: "read",
    title: "error.log",
    description: "读取服务日志，定位异常堆栈",
    status: "done",
    timestamp: "00:01",
    detail: "2024-06-10 14:23:01 ERROR [main] NullPointerException at UserService.java:142\n  at com.app.service.UserService.getProfile(UserService.java:142)\n  at com.app.controller.UserController.profile(UserController.java:58)\nCaused by: Missing user session token",
  },
  {
    id: "2",
    type: "search",
    title: "知识库检索: NullPointerException",
    description: "搜索历史排障记录与解决方案",
    status: "done",
    timestamp: "00:03",
    detail: "匹配到 2 篇相关文档:\n1. 排障记录_20240601.md (相关度 0.93)\n   > 问题: 用户登录后 session token 为空\n   > 根因: Redis 连接超时导致 session 未持久化\n2. 常见问题_FAQ.md (相关度 0.85)\n   > Q: 出现 NullPointerException 如何排查?\n   > A: 检查上下文注入和空值守卫...",
  },
  {
    id: "3",
    type: "analyze",
    title: "分析 Redis 连接状态",
    description: "检查缓存服务健康状态与连接池配置",
    status: "done",
    timestamp: "00:05",
    detail: "Redis 连接池状态:\n  - 活跃连接数: 8/10\n  - 等待队列: 3\n  - 超时次数(近1h): 12\n  - 平均响应时间: 450ms (正常 < 50ms)\n\n⚠️ 发现异常: 连接池接近饱和，响应时间显著偏高",
  },
  {
    id: "4",
    type: "read",
    title: "redis-config.yaml",
    description: "读取 Redis 配置文件，检查连接池参数",
    status: "done",
    timestamp: "00:06",
    detail: "redis:\n  host: 10.0.1.50\n  port: 6379\n  pool:\n    max-active: 10\n    max-idle: 5\n    min-idle: 2\n    max-wait: 3000ms\n  timeout: 2000ms\n\n# 建议: max-active 偏低，建议提升至 50",
  },
  {
    id: "5",
    type: "generate",
    title: "排障报告_20240610.md",
    description: "生成排障总结报告与修复建议",
    status: "running",
    timestamp: "00:08",
    detail: "# 排障报告\n\n## 问题描述\n用户登录后访问个人主页出现 500 错误\n\n## 根因分析\nRedis 连接池配置过小，高并发下连接耗尽...\n\n## 修复建议\n1. 调整 max-active 至 50\n2. 增加连接池监控告警\n3. 添加 session 空值降级逻辑",
  },
  {
    id: "6",
    type: "generate",
    title: "hotfix-redis-pool.patch",
    description: "生成配置修复补丁文件",
    status: "pending",
    timestamp: "",
  },
];

export function TroubleshootView() {
  const [resource, setResource] = useState<{ title: string; content: string } | null>(null);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const hasLoadedRef = useRef(false);

  // Simulate streaming actions on mount
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    demoActions.forEach((action, i) => {
      setTimeout(() => {
        setActions((prev) => [...prev, action]);
      }, (i + 1) * 600);
    });
  }, []);

  return (
    <div className="flex-1 flex min-h-0 h-screen">
      {/* Left: AI Chat */}
      <div className="flex-1 flex justify-center border-r border-border">
        <AIChat
          className="w-full flex flex-col h-full max-w-2xl"
          onResourceClick={(title, content) => setResource({ title, content })}
        />
      </div>

      {/* Right: Action Viewer */}
      <div className="flex-1 flex flex-col min-h-0">
        <ActionViewer actions={actions} />
      </div>

      {/* Optional Resource Panel */}
      {resource && (
        <div className="w-[420px] shrink-0 h-full">
          <ResourcePanel
            title={resource.title}
            content={resource.content}
            onClose={() => setResource(null)}
          />
        </div>
      )}
    </div>
  );
}
