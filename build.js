const fs = require('fs-extra');
const path = require('path');
const markdownIt = require('markdown-it');

const md = new markdownIt();

async function build() {
  const articlesDir = path.join(__dirname, 'articles'); // Chemin mis à jour
  const outputDir = path.join(__dirname, 'articles'); // Dossier de sortie pour les fichiers HTML

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
      const match = content.match(/---\n([\s\S]+?)\n---\n([\s\S]*)/);
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
          <title>${metadata.title}</title>
          <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
          <article>
            <h1>${metadata.title}</h1>
            <p><em>Publié le ${new Date(metadata.date).toLocaleDateString('fr-FR')}</em></p>
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
          url: `/articles_html/${outputFileName}`
        });
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
