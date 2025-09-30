document.addEventListener("DOMContentLoaded", () => {
    const menu = document.querySelector("nav ul.menu");

    fetch("data/articles.json")
        .then(res => res.json())
        .then(articles => {
            articles.forEach(article => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = article.url;
                a.textContent = article.title;
                li.appendChild(a);
                menu.appendChild(li);
            });
        })
        .catch(err => console.error("Erreur chargement articles:", err));
});
