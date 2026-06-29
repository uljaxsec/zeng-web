const params = new URLSearchParams(window.location.search);
const articleId = params.get("id") || "01";
const article = (window.ARTICLE_DATA || []).find((item) => item.id === articleId);

const escapeHtml = (value) => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

const renderInline = (value) => escapeHtml(value)
  .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
  .replace(/`([^`]+)`/g, "<code>$1</code>");

const renderMarkdown = (markdown) => {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let inCode = false;
  let codeLines = [];

  const flushCode = () => {
    html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    codeLines = [];
  };

  lines.forEach((line) => {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        flushCode();
      }
      inCode = !inCode;
      return;
    }

    if (inCode) {
      codeLines.push(line);
      return;
    }

    if (!line.trim()) {
      return;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      const level = heading[1].length + 1;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      return;
    }

    html.push(`<p>${renderInline(line)}</p>`);
  });

  if (inCode) {
    flushCode();
  }

  return html.join("");
};

if (article) {
  document.title = `${article.title} - 技术文章`;
  document.querySelector("#articleCategory").textContent = article.category;
  document.querySelector("#articleTitle").textContent = article.title;
  document.querySelector("#articleSummary").textContent = article.summary;
  document.querySelector("#articleContent").innerHTML = renderMarkdown(article.content);
} else {
  document.querySelector("#articleTitle").textContent = "文章不存在";
  document.querySelector("#articleSummary").textContent = "没有找到对应的文章，请返回文章列表重新选择。";
}
