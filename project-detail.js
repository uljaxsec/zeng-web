const params = new URLSearchParams(window.location.search);
const projectId = params.get("id") || "iot";
const project = (window.PROJECT_DATA || []).find((item) => item.id === projectId);

const escapeHtml = (value) => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

const renderProjectContent = (content) => {
  const sectionTitles = new Set([
    "综合态势",
    "展厅流量",
    "设备态势",
    "运维态势",
    "告警态势",
    "投诉建议",
    "资讯公告",
    "物品放行",
    "空调加时",
    "访客管理",
    "预约服务扩展"
  ]);

  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (sectionTitles.has(block)) {
        return `<h2>${escapeHtml(block)}</h2>`;
      }

      return `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
};

if (project) {
  document.title = `${project.code} ${project.title} - 项目作品`;
  document.querySelector("#projectCode").textContent = project.code;
  document.querySelector("#projectTitle").textContent = project.title;
  document.querySelector("#projectSummary").textContent = project.summary;
  document.querySelector("#projectContent").innerHTML = renderProjectContent(project.content);
} else {
  document.querySelector("#projectTitle").textContent = "项目不存在";
  document.querySelector("#projectSummary").textContent = "没有找到对应的项目，请返回项目列表重新选择。";
}
