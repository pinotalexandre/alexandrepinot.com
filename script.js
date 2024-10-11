const hoverLinks = document.querySelectorAll('.hover-link');
const logo = document.getElementById('logo');

hoverLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        logo.src = link.getAttribute('data-logo');
        logo.style.display = 'block';
    });

    link.addEventListener('mousemove', (e) => {
        logo.style.left = `${e.pageX + 10}px`;
        logo.style.top = `${e.pageY + 10}px`;
    });

    link.addEventListener('mouseleave', () => {
        logo.style.display = 'none';
    });
});

const emoji = document.getElementById('rain');
const tooltip = document.getElementById('tooltip');

emoji.addEventListener('mouseenter', () => {
    const emojiRect = emoji.getBoundingClientRect();
    tooltip.style.left = `${emojiRect.left + window.scrollX}px`;
    tooltip.style.top = `${emojiRect.top - tooltip.offsetHeight + window.scrollY - 10}px`;
    tooltip.style.display = 'block';
});

emoji.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
});

emoji.addEventListener('click', () => {
    const emojiContainer = document.getElementById('rain-container');
    const emojiList = ['🧙', '🪄', '✨', '🧙‍♀️', '🕴️'];

    for (let i = 0; i < 30; i++) {
        const emojiDiv = document.createElement('div');
        emojiDiv.classList.add('emoji');
        emojiDiv.textContent = emojiList[Math.floor(Math.random() * emojiList.length)];
        emojiDiv.style.left = `${Math.random() * 100}vw`;
        emojiDiv.style.top = '-50px';
        emojiDiv.style.animationDelay = `${Math.random() * 2}s`;
        emojiDiv.style.transform = `translateX(${Math.random() * 20 - 10}px)`;

        emojiContainer.appendChild(emojiDiv);
        setTimeout(() => emojiDiv.remove(), 4000);
    }
});
document.addEventListener("DOMContentLoaded", function() {
    const articlesContainer = document.getElementById("recent-articles");
    
    // Remplacez cette partie par l'emplacement de votre dossier d'articles
    const articles = [
        { title: "Titre de l'article 1", url: "blog/public/posts/mon-deuxieme-article" },
        { title: "Titre de l'article 2", url: "blog/public/posts/mon-deuxieme-article" },
        { title: "Titre de l'article 3", url: "blog/public/posts/mon-deuxieme-article" }
        // Ajoutez d'autres articles ici
    ];

    articles.forEach(article => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = article.url;
        a.textContent = article.title;
        li.appendChild(a);
        articlesContainer.appendChild(li);
    });
});
