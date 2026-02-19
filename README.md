# Blog

一个可直接部署到 Vercel 的 Markdown 博客。

## 本地运行

```bash
npm install
npm run dev
```

如果依赖没有装好，可先执行：

```bash
npm run install:frontend
```

## 发布文章

1. 在 `frontend/src/content/posts/` 新建 `.md` 文件（文件名会作为默认 slug）
2. 在文件顶部写 frontmatter：

```md
---
title: 文章标题
date: 2026-02-19
summary: 文章摘要
tags: 标签1, 标签2
---
```

3. 提交并推送后，Vercel 自动构建上线

## Vercel 部署

直接导入这个仓库即可（根目录有 `vercel.json`，会自动使用 `frontend` 构建）。
