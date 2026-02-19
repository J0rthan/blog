# Blog

一个可直接部署到 Vercel 的 Markdown 博客，支持：

- 文章列表与文章详情页
- 文章字数统计、预计阅读时长
- 项目独立页面（顶部导航：`首页` / `项目`）
- 打赏独立页面

## 本地运行

```bash
npm install
npm run dev
```

如果依赖没有装好，可先执行：

```bash
npm run install:frontend
```

## 如何添加文章

1. 在 `frontend/src/content/posts/` 新建一个 `.md` 文件  
   文件名会作为默认 slug，例如 `my-first-post.md` -> `#/post/my-first-post`
2. 在文件顶部写 frontmatter（必须是 `---` 包裹）
3. 在 frontmatter 下方写正文 Markdown

示例：

```md
---
title: 我的第一篇文章
date: 2026-02-19
summary: 这是一段文章摘要，会显示在列表卡片中。
tags: 技术, Vue, Vercel
---

# 正文标题

这里是正文内容。
```

frontmatter 字段说明：

- `title`: 文章标题
- `date`: 日期（建议 `YYYY-MM-DD`）
- `summary`: 列表摘要
- `tags`: 标签，英文逗号分隔

## 如何添加项目

项目列表数据在：

- `frontend/src/App.vue`

找到 `const projects = [...]`，按同样结构新增对象即可。

示例：

```js
{
  name: "My Project",
  summary: "项目简介",
  stack: "Vue 3, Vite",
  link: "https://example.com"
}
```

字段说明：

- `name`: 项目名称
- `summary`: 项目描述
- `stack`: 技术栈
- `link`: 项目链接（可填站点、仓库地址等）

## 打赏码替换

默认收款码文件：

- `frontend/public/payment-qr.svg`

你可以直接用自己的收款码图片覆盖这个文件（同名即可）。

## Vercel 部署

直接导入这个仓库即可（根目录已包含 `vercel.json`）。
每次推送代码后，Vercel 会自动重新构建发布。
