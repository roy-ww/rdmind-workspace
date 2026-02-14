import { useState, useRef, useCallback } from "react";
import { FileText, ChevronRight, Download, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const sampleHtml = `<h1>项目规划与任务管理</h1>

<h2>一、项目概述</h2>

<p>本文档记录了 <strong>RDMind Studio</strong> 项目的整体规划，包括技术架构、开发路线图和团队协作流程。</p>

<blockquote><strong>核心目标：</strong> 构建一个高效的 AI 驱动知识管理平台，帮助用户组织、检索和创作内容。</blockquote>

<hr/>

<h2>二、技术栈</h2>

<table>
<thead><tr><th>模块</th><th>技术选型</th><th>状态</th></tr></thead>
<tbody>
<tr><td>前端框架</td><td>React 18 + TypeScript</td><td>✅ 已完成</td></tr>
<tr><td>UI 组件</td><td>Shadcn UI + Tailwind CSS</td><td>✅ 已完成</td></tr>
<tr><td>状态管理</td><td>Zustand</td><td>🔄 进行中</td></tr>
<tr><td>后端服务</td><td>Supabase (PostgreSQL)</td><td>📋 计划中</td></tr>
<tr><td>AI 引擎</td><td>LangChain + OpenAI API</td><td>📋 计划中</td></tr>
<tr><td>部署平台</td><td>Vercel</td><td>✅ 已完成</td></tr>
</tbody>
</table>

<h2>三、功能模块</h2>

<h3>3.1 知识库管理</h3>

<ul>
<li><input type="checkbox" checked disabled /> 文件目录树浏览</li>
<li><input type="checkbox" checked disabled /> Markdown 文档编辑</li>
<li><input type="checkbox" disabled /> 文件上传与解析（PDF、Word、PPT）</li>
<li><input type="checkbox" disabled /> 自动标签与分类</li>
<li><input type="checkbox" disabled /> 全文搜索与语义检索</li>
</ul>

<h3>3.2 AI 助手</h3>

<ol>
<li><strong>智能问答</strong>：基于知识库内容回答用户问题</li>
<li><strong>文档摘要</strong>：自动生成文档摘要和关键要点</li>
<li><strong>内容创作</strong>：根据提示词生成文章、报告</li>
<li><strong>代码分析</strong>：代码审查、Bug 排查、重构建议</li>
</ol>

<h3>3.3 协作功能</h3>

<ul>
<li>实时多人编辑 (<em>计划中</em>)</li>
<li>评论与批注</li>
<li>版本历史回溯</li>
</ul>

<h2>四、开发路线图</h2>

<pre><code>Q1 2024: 基础架构搭建 ✅
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
  └── 正式上线</code></pre>

<h2>五、API 设计示例</h2>

<pre><code class="language-typescript">interface KnowledgeBase {
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
): Promise&lt;Document[]&gt; {
  const embedding = await generateEmbedding(query);
  return await vectorSearch(embedding, topK);
}</code></pre>

<h2>六、注意事项</h2>

<blockquote>⚠️ <strong>安全提醒</strong>：所有 API Key 必须存储在环境变量中，<em>禁止</em>硬编码到源代码。</blockquote>

<ul>
<li>定期备份数据库</li>
<li>监控 API 调用量和成本</li>
<li>遵循 <code>OWASP Top 10</code> 安全规范</li>
</ul>

<hr/>

<p><em>最后更新：2024-01-15 | 作者：RDMind 团队</em></p>`;

interface MarkdownEditorProps {
  fileName: string;
}

export function MarkdownEditor({ fileName }: MarkdownEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const folder = "00_收件箱";

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top bar */}
      <div className="px-4 py-2.5 border-b border-border flex items-center justify-between shrink-0 bg-background">
        <div className="flex items-center gap-2">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" />
              导出
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {
              const content = editorRef.current?.innerText || "";
              const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = fileName.endsWith(".md") ? fileName : fileName + ".md";
              a.click();
              URL.revokeObjectURL(url);
              toast({ title: "导出成功", description: `已导出 ${a.download}` });
            }}>
              <FileText className="h-4 w-4 mr-2" />
              导出 MD 文件
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              const content = editorRef.current?.innerHTML || "";
              const blob = new Blob([content], { type: "text/html;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = fileName.replace(/\.md$/, "") + ".reddoc";
              a.click();
              URL.revokeObjectURL(url);
              toast({ title: "导出成功", description: `已导出 ${a.download}` });
            }}>
              <Globe className="h-4 w-4 mr-2" />
              导出 RedDoc
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* WYSIWYG Editor - scrollable */}
      <div className="flex-1 overflow-auto">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="wysiwyg-editor p-6 min-h-full focus:outline-none text-foreground"
          dangerouslySetInnerHTML={{ __html: sampleHtml }}
        />
      </div>
    </div>
  );
}
