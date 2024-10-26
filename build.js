const fs = require('fs-extra');
const path = require('path');
const markdownIt = require('markdown-it');

const md = new markdownIt();

async function build() {
  const articlesDir = path.join(__dirname, 'articles'); // Chemin vers votre dossier articles
  const outputDir = path.join(__dirname, 'notes'); // Dossier de sortie pour les HTML

  // Créer le dossier de sortie s'il n'existe pas
  await fs.ensureDir(outputDir);

  // Récupérer tous les fichiers Markdown
  const files = await fs.readdir(articlesDir);

  const articlesList = [];

  for (const file of files) {
    if (path.extname(file) === '.md') {
      const filePath = path.join(articlesDir, file);
      const content = await fs.readFile(filePath, 'utf-8');

      // Séparer le front matter du contenu
      const match = content.match(/---\s*\n([\s\S]+?)\n---\s*\n([\s\S]*)/);
      if (match) {
        const frontMatter = match[1];
        const body = match[2];

        // Extraire les données du front matter
        const metadata = {};
        frontMatter.split('\n').forEach(line => {
          const [key, value] = line.split(':').map(s => s.trim());
          metadata[key] = value;
        });

        // Convertir le contenu Markdown en HTML
        const htmlContent = md.render(body);

        // Créer la page HTML
        const htmlPage = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Alexandre Pinot is a Product Designer at Dust, specializing in AI integration into workflows. Explore his projects and insights on design, innovation, and technology.">
  <meta name="keywords" content="Alexandre Pinot, Product Designer, AI integration, Dust, UX/UI design, innovation, product design, tech, San Francisco, Paris">
  <meta name="author" content="Alexandre Pinot">
  <meta property="og:title" content="Alexandre Pinot - Product Designer @Dust">
  <meta property="og:description" content="Alexandre Pinot is a Product Designer at Dust, integrating AI into workflows. Discover his portfolio, projects, and insights on design and technology.">
  <meta property="og:image" content="static/img/pp.webp">
  <meta property="og:url" content="https://alexandrepinot.co">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Alexandre Pinot - Product Designer @Dust">
  <meta name="twitter:description" content="Explore Alexandre Pinot's portfolio, a Product Designer at Dust focusing on AI-enhanced workflows.">
  <meta name="twitter:image" content="static/img/pp.webp">
  <meta name="robots" content="index, follow">
  <title>Alexandre Pinot - Product Designer @Dust</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://fonts.gstatic.com">
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap"></noscript>
  <link rel="stylesheet" href="../styles.css">
  <link rel="preload" as="image" href="static/img/pp.webp">
  <link rel="preload" as="image" href="static/img/dust-logo.webp">
  <link rel="preload" as="image" href="static/img/malt-logo.webp">
        </head>
        <body>
          <article>
          <a href="../index.html">← Back</a>
            <h1 class="blog_title">${metadata.title}</h1>
            <p class="blog_text"><em>${new Date(metadata.date).toLocaleDateString('fr-FR')}</em></p>
            ${htmlContent}
          </article>
        </body>
        </html>
        `;

        // Enregistrer la page HTML
        const outputFileName = `${path.basename(file, '.md')}.html`;
        const outputPath = path.join(outputDir, outputFileName);
        await fs.writeFile(outputPath, htmlPage, 'utf-8');

        // Ajouter l'article à la liste
        articlesList.push({
          title: metadata.title,
          date: metadata.date,
          url: `/notes/${outputFileName}`
        });
      } else {
        console.error(`Le fichier ${filePath} n'a pas un front matter correctement formaté.`);
      }
    }
  }

  // Générer le fichier JSON pour la liste des articles
  await fs.writeFile(
    path.join(outputDir, 'articles.json'),
    JSON.stringify(articlesList, null, 2),
    'utf-8'
  );

  console.log('Build terminé avec succès.');
}

build().catch(err => console.error(err));
