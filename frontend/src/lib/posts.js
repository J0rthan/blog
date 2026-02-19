function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---\n")) {
    return { meta: {}, content: raw };
  }

  const end = raw.indexOf("\n---\n", 4);
  if (end === -1) {
    return { meta: {}, content: raw };
  }

  const header = raw.slice(4, end).split("\n");
  const content = raw.slice(end + 5);
  const meta = {};

  for (const line of header) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    meta[key] = value;
  }

  return { meta, content };
}

function inlineMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function markdownToHtml(raw) {
  const normalized = raw.replace(/\r\n/g, "\n");
  const blocks = normalized.split(/\n{2,}/);

  return blocks
    .map((block) => {
      const safe = escapeHtml(block.trim());
      if (!safe) return "";

      if (safe.startsWith("### ")) return `<h3>${inlineMarkdown(safe.slice(4))}</h3>`;
      if (safe.startsWith("## ")) return `<h2>${inlineMarkdown(safe.slice(3))}</h2>`;
      if (safe.startsWith("# ")) return `<h1>${inlineMarkdown(safe.slice(2))}</h1>`;

      if (safe.startsWith("- ")) {
        const lines = safe.split("\n").filter((line) => line.startsWith("- "));
        const items = lines.map((line) => `<li>${inlineMarkdown(line.slice(2))}</li>`).join("");
        return `<ul>${items}</ul>`;
      }

      if (safe.startsWith("```") && safe.endsWith("```")) {
        const lines = safe.split("\n");
        const lang = lines[0].slice(3).trim();
        const code = lines.slice(1, -1).join("\n");
        return `<pre><code class="lang-${lang}">${code}</code></pre>`;
      }

      return `<p>${inlineMarkdown(safe).replaceAll("\n", "<br />")}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}

function countWords(text) {
  const cjkCount = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const westernCount = (text
    .replace(/[\u4e00-\u9fff]/g, " ")
    .match(/[A-Za-z0-9_]+/g) || []).length;

  return cjkCount + westernCount;
}

function slugFromPath(path) {
  const file = path.split("/").pop() || "";
  return file.replace(/\.md$/, "").toLowerCase();
}

function parseTags(raw) {
  if (!raw) return [];
  return raw
    .split(/[,\uFF0C\u3001;|\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getAllPosts() {
  const files = import.meta.glob("../content/posts/*.md", {
    eager: true,
    import: "default",
    query: "?raw",
  });

  return Object.entries(files)
    .map(([path, raw]) => {
      const { meta, content } = parseFrontmatter(raw);
      const wordCount = countWords(content);

      return {
        slug: meta.slug || slugFromPath(path),
        title: meta.title || "未命名文章",
        date: meta.date || "未设置日期",
        summary: meta.summary || "",
        tags: parseTags(meta.tags),
        wordCount,
        readingMinutes: Math.max(1, Math.ceil(wordCount / 300)),
        html: markdownToHtml(content),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
