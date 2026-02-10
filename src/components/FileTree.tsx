import { useState } from "react";
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreeNode {
  name: string;
  type: "folder" | "file";
  children?: TreeNode[];
}

const fileTree: TreeNode[] = [
  {
    name: "00_收件箱",
    type: "folder",
    children: [
      { name: "待处理笔记.md", type: "file" },
      { name: "临时想法.md", type: "file" },
    ],
  },
  {
    name: "10_日记",
    type: "folder",
    children: [
      { name: "2024-01-15.md", type: "file" },
      { name: "2024-01-14.md", type: "file" },
    ],
  },
  {
    name: "20_项目",
    type: "folder",
    children: [
      { name: "项目A_规划.md", type: "file" },
      { name: "项目B_文档.md", type: "file" },
      { name: "项目C_笔记.md", type: "file" },
    ],
  },
  {
    name: "30_知识库",
    type: "folder",
    children: [
      { name: "技术笔记.md", type: "file" },
      { name: "阅读摘要.md", type: "file" },
    ],
  },
  {
    name: "40_归档",
    type: "folder",
    children: [],
  },
];

interface FileTreeProps {
  onFileSelect?: (fileName: string) => void;
  selectedFile?: string | null;
}

function TreeItem({
  node,
  depth = 0,
  onFileSelect,
  selectedFile,
}: {
  node: TreeNode;
  depth?: number;
  onFileSelect?: (fileName: string) => void;
  selectedFile?: string | null;
}) {
  const [open, setOpen] = useState(depth < 1);

  if (node.type === "file") {
    const isActive = selectedFile === node.name;
    return (
      <button
        onClick={() => onFileSelect?.(node.name)}
        className={cn(
          "flex items-center gap-2 w-full py-1.5 px-2 rounded-md text-sm transition-colors",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
        style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}
      >
        <FileText className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{node.name}</span>
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 w-full py-1.5 px-2 rounded-md text-sm font-medium text-foreground hover:bg-accent transition-colors"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        )}
        {open ? (
          <FolderOpen className="h-3.5 w-3.5 shrink-0 text-primary" />
        ) : (
          <Folder className="h-3.5 w-3.5 shrink-0 text-primary" />
        )}
        <span className="truncate">{node.name}</span>
      </button>
      {open &&
        node.children?.map((child) => (
          <TreeItem
            key={child.name}
            node={child}
            depth={depth + 1}
            onFileSelect={onFileSelect}
            selectedFile={selectedFile}
          />
        ))}
    </div>
  );
}

export function FileTree({ onFileSelect, selectedFile }: FileTreeProps) {
  return (
    <div className="space-y-0.5">
      {fileTree.map((node) => (
        <TreeItem
          key={node.name}
          node={node}
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
        />
      ))}
    </div>
  );
}
