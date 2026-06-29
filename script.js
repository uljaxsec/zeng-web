const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const articleList = document.querySelector("#articleList");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

links.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const setActiveLink = () => {
  let currentId = "home";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentId = section.id;
    }
  });

  links.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
};

window.addEventListener("scroll", setActiveLink);
setActiveLink();

if (articleList && window.ARTICLE_DATA) {
  articleList.innerHTML = window.ARTICLE_DATA.map((article, index) => `
    <a class="article-list-item" href="article-detail.html?id=${article.id}">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <div>
        <strong>${article.category}</strong>
        <h3>${article.title}</h3>
      </div>
      <p>${article.summary}</p>
    </a>
  `).join("");
}
