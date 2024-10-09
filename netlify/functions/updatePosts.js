const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    // Vérifiez que l'événement provient de Netlify CMS
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' })
        };
    }

    const body = JSON.parse(event.body);

    // Chemin vers le fichier JSON
    const postsPath = path.join(__dirname, '../../posts.json');

    // Lire le contenu actuel du fichier posts.json
    let posts;
    try {
        const data = fs.readFileSync(postsPath);
        posts = JSON.parse(data);
    } catch (err) {
        console.error('Erreur de lecture du fichier posts.json:', err);
        posts = { posts: [] }; // Si le fichier n'existe pas, créez un nouveau tableau
    }

    // Ajoutez le nouvel article à la liste
    const newPost = {
        title: body.title,
        slug: body.slug,
        date: body.date
    };

    posts.posts.push(newPost);

    // Écrire le contenu mis à jour dans le fichier posts.json
    try {
        fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Post ajouté avec succès!' })
        };
    } catch (err) {
        console.error('Erreur d\'écriture dans le fichier posts.json:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erreur lors de la mise à jour du fichier JSON' })
        };
    }
};
