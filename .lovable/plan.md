

## Plan: Markdown Editor + AI Chat Demo

### Overview
When clicking "待处理笔记.md" in the file tree, the center area replaces the welcome screen with a rich markdown document that is editable. After clicking the send button in the right panel, the right panel shows a demo AI chat conversation with user messages, AI thinking process, and AI responses.

### Changes

#### 1. FileTree.tsx - Add file selection callback
- Accept an `onFileSelect` prop of type `(fileName: string) => void`
- Call it when a file node is clicked
- Highlight the currently selected file with an active style

#### 2. KnowledgeBaseView.tsx - State management and conditional rendering
- Add `selectedFile` state to track which file is open
- Pass `onFileSelect` to `FileTree`
- **Center area**: When `selectedFile` is set, render a `MarkdownEditor` component instead of the welcome screen
- **Right panel**: Add `chatMessages` state. When user clicks send, populate it with demo messages (user message, AI thinking block, AI response). Render chat messages list instead of the tips.

#### 3. New component: MarkdownEditor.tsx
- Receives file name as prop, displays a rich sample markdown document in a `<textarea>` (editable)
- The sample document will include: headings (h1/h2/h3), bullet lists, numbered lists, code blocks, bold/italic text, tables, blockquotes, links -- all as raw markdown text in an editable textarea
- Top bar showing the file name and a breadcrumb
- Styled with monospace font for editing, full height scrollable area

#### 4. Right panel AI chat demo
- When send is clicked with text, add to `chatMessages` array:
  1. A **user message** bubble (right-aligned, with the input text)
  2. An **AI thinking** block (collapsible, italic, shows "thinking" process)
  3. An **AI response** bubble (left-aligned, with markdown-formatted content)
- Messages rendered in a scrollable list with distinct styling for user vs AI
- AI thinking section shown in a muted collapsible block with a "thinking" indicator

### Technical Details

- **No new dependencies** needed -- using native textarea for editing, manual styling for chat bubbles
- Sample markdown content will be a complex Chinese document about project planning with various markdown elements
- Chat demo messages are hardcoded mock data triggered on send
- File selection state lifted to `KnowledgeBaseView` and passed down to `FileTree`

