function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function highlightCode(code, lang = "") {
  const language = (lang || "").toLowerCase();
  const source = escapeHtml(code);
  const placeholders = [];

  const stash = (value) => {
    const key = `__TOKEN_${placeholders.length}__`;
    placeholders.push(value);
    return key;
  };

  // comments first to avoid getting matched by keyword/string rules
  let highlighted = source
    .replace(/(\/\/[^\n]*)/g, (m) => stash(`<span class="tok-comment">${m}</span>`))
    .replace(/(\/\*[\s\S]*?\*\/)/g, (m) => stash(`<span class="tok-comment">${m}</span>`))
    .replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;)/g, (m) => stash(`<span class="tok-string">${m}</span>`));

  const keywordSets = {
    c: "auto break case char const continue default do double else enum extern float for goto if int long register return short signed sizeof static struct switch typedef union unsigned void volatile while",
    cpp: "alignas alignof asm auto bool break case catch char class const constexpr continue default delete do double else enum explicit export extern false float for friend goto if inline int long mutable namespace new noexcept nullptr operator private protected public register reinterpret_cast return short signed sizeof static struct switch template this throw true try typedef typeid typename union unsigned using virtual void volatile while",
    js: "await break case catch class const continue debugger default delete do else export extends false finally for function if import in instanceof let new null of return super switch this throw true try typeof var void while with yield",
    ts: "abstract any as assert bigint boolean break case catch class const constructor continue debugger declare default delete do else enum export extends false finally for from function get if implements import in infer instanceof interface is keyof let module namespace never new null number object of package private protected public readonly require return set static string super switch symbol this throw true try type typeof undefined unique unknown var void while with yield",
    java: "abstract assert boolean break byte case catch char class const continue default do double else enum extends false final finally float for goto if implements import instanceof int interface long native new null package private protected public return short static strictfp super switch synchronized this throw throws transient true try void volatile while",
    py: "and as assert break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield",
  };

  const fallbackKeywords = keywordSets.js;
  const languageKeywords =
    keywordSets[language] ||
    (language.includes("c") ? keywordSets.c : "") ||
    (language.includes("java") ? keywordSets.java : "") ||
    (language.includes("python") ? keywordSets.py : "") ||
    fallbackKeywords;

  if (languageKeywords) {
    const pattern = new RegExp(`\\b(${languageKeywords.replaceAll(" ", "|")})\\b`, "g");
    highlighted = highlighted.replace(pattern, '<span class="tok-keyword">$1</span>');
  }

  highlighted = highlighted
    .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-number">$1</span>')
    .replace(/(^|\n)(\s*#\s*[A-Za-z_]+)/g, '$1<span class="tok-operator">$2</span>');

  return highlighted.replace(/__TOKEN_(\d+)__/g, (_, i) => placeholders[Number(i)]);
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
  const normalizeImageSrc = (src) => {
    const value = src.trim();
    if (value.startsWith("../../../public/")) return `/${value.replace("../../../public/", "")}`;
    return value;
  };

  return text
    .replace(/!\[(.*?)\]\(([^)\s]+)\)/g, (_, alt, src) => {
      const safeAlt = alt || "image";
      const safeSrc = normalizeImageSrc(src);
      return `<img src="${safeSrc}" alt="${safeAlt}" loading="lazy" />`;
    })
    .replace(/``([^`]+?)``/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function markdownToHtml(raw) {
  const normalized = raw.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const html = [];
  let textBuffer = [];
  let inCodeBlock = false;
  let codeLang = "";
  let codeLines = [];

  const flushTextBuffer = () => {
    if (textBuffer.length === 0) return;

    const block = textBuffer.join("\n").trim();
    textBuffer = [];
    if (!block) return;

    const blockLines = block.split("\n");
    if (blockLines.length === 1) {
      const line = blockLines[0];
      if (line.startsWith("### ")) {
        html.push(`<h3>${inlineMarkdown(escapeHtml(line.slice(4)))}</h3>`);
        return;
      }
      if (line.startsWith("## ")) {
        html.push(`<h2>${inlineMarkdown(escapeHtml(line.slice(3)))}</h2>`);
        return;
      }
      if (line.startsWith("# ")) {
        html.push(`<h1>${inlineMarkdown(escapeHtml(line.slice(2)))}</h1>`);
        return;
      }
    }

    const isList = blockLines.every((line) => line.trim().startsWith("- "));
    if (isList) {
      const items = blockLines
        .map((line) => line.trim().slice(2))
        .map((item) => `<li>${inlineMarkdown(escapeHtml(item))}</li>`)
        .join("");
      html.push(`<ul>${items}</ul>`);
      return;
    }

    html.push(`<p>${inlineMarkdown(escapeHtml(block)).replaceAll("\n", "<br />")}</p>`);
  };

  for (const line of lines) {
    if (inCodeBlock) {
      if (line.startsWith("```")) {
        const code = highlightCode(codeLines.join("\n"), codeLang);
        html.push(`<pre><code class="lang-${codeLang} hl-code">${code}</code></pre>`);
        inCodeBlock = false;
        codeLang = "";
        codeLines = [];
      } else {
        codeLines.push(line);
      }
      continue;
    }

    if (line.startsWith("```")) {
      flushTextBuffer();
      inCodeBlock = true;
      codeLang = line.slice(3).trim();
      codeLines = [];
      continue;
    }

    if (line.trim() === "") {
      flushTextBuffer();
      continue;
    }

    textBuffer.push(line);
  }

  flushTextBuffer();

  if (inCodeBlock) {
    const code = highlightCode(codeLines.join("\n"), codeLang);
    html.push(`<pre><code class="lang-${codeLang} hl-code">${code}</code></pre>`);
  }

  return html.join("\n");
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
