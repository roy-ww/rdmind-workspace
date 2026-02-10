import { useState } from "react";
import { FileText, ChevronRight } from "lucide-react";

const sampleMarkdown = `# 项目规划与任务管理

## 一、项目概述

本文档记录了 **RDMind Studio** 项目的整体规划，包括技术架构、开发路线图和团队协作流程。

> **核心目标：** 构建一个高效的 AI 驱动知识管理平台，帮助用户组织、检索和创作内容。

---

## 二、技术栈

| 模块 | 技术选型 | 状态 |
|------|---------|------|
| 前端框架 | React 18 + TypeScript | ✅ 已完成 |
| UI 组件 | Shadcn UI + Tailwind CSS | ✅ 已完成 |
| 状态管理 | Zustand | 🔄 进行中 |
| 后端服务 | Supabase (PostgreSQL) | 📋 计划中 |
| AI 引擎 | LangChain + OpenAI API | 📋 计划中 |
| 部署平台 | Vercel | ✅ 已完成 |

## 三、功能模块

### 3.1 知识库管理

- [x] 文件目录树浏览
- [x] Markdown 文档编辑
- [ ] 文件上传与解析（PDF、Word、PPT）
- [ ] 自动标签与分类
- [ ] 全文搜索与语义检索

### 3.2 AI 助手

1. **智能问答**：基于知识库内容回答用户问题
2. **文档摘要**：自动生成文档摘要和关键要点
3. **内容创作**：根据提示词生成文章、报告
4. **代码分析**：代码审查、Bug 排查、重构建议

### 3.3 协作功能

- 实时多人编辑 (*计划中*)
- 评论与批注
- 版本历史回溯

## 四、开发路线图

\`\`\`
Q1 2024: 基础架构搭建 ✅
  ├── 项目初始化
  ├── UI 组件库集成
  └── 基础路由与布局

Q2 2024: 核心功能开发 🔄
  ├── 知识库 CRUD
  ├── Markdown 编辑器
  └── AI 对话集成

Q3 2024: 高级功能 📋
  ├── 语义搜索
  ├── 多模态支持
  └── 协作编辑

Q4 2024: 优化与发布 📋
  ├── 性能优化
  ├── 安全审计
  └── 正式上线
\`\`\`

## 五、API 设计示例

\`\`\`typescript
interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

interface Document {
  id: string;
  title: string;
  content: string;
  tags: string[];
  embedding?: number[];
}

// 检索相关文档
async function searchDocuments(
  query: string,
  topK: number = 5
): Promise<Document[]> {
  const embedding = await generateEmbedding(query);
  return await vectorSearch(embedding, topK);
}
\`\`\`

## 六、注意事项

> ⚠️ **安全提醒**：所有 API Key 必须存储在环境变量中，*禁止*硬编码到源代码。

- 定期备份数据库
- 监控 API 调用量和成本
- 遵循 \`OWASP Top 10\` 安全规范

---

*最后更新：2024-01-15 | 作者：RDMind 团队*
`;

interface MarkdownEditorProps {
  fileName: string;
}

export function MarkdownEditor({ fileName }: MarkdownEditorProps) {
  const [content, setContent] = useState(sampleMarkdown);

  // Extract parent folder from known structure
  const folder = "00_收件箱";

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top bar */}
      <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 shrink-0 bg-background">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>docs_studio</span>
          <ChevronRight className="h-3 w-3" />
          <span>{folder}</span>
          <ChevronRight className="h-3 w-3" />
        </div>
        <div className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm font-medium text-foreground">{fileName}</span>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full min-h-full p-6 bg-background text-foreground text-sm font-mono leading-relaxed resize-none focus:outline-none"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
