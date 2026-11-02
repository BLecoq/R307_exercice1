-- =============================================================================
-- PARTIE A · Question 3 · Six requetes
-- Sous chaque question : votre requete, puis le resultat obtenu, en commentaire.
-- =============================================================================

-- R1. Les commentaires de l'article 2, du plus recent au plus ancien : nom, texte.
SELECT nom, texte FROM commentaires WHERE article_id = 2 
ORDER BY cree_le DESC;

-- R2. Le nombre de commentaires de CHAQUE article, y compris ceux qui n'en ont aucun :
--     id, titre, nb_commentaires.
SELECT articles.id, articles.titre, COUNT(commentaires.id) AS nb_commentaires
FROM articles
LEFT JOIN commentaires 
ON articles.id = commentaires.article_id
GROUP BY articles.id, articles.titre
ORDER BY articles.id;

-- R3. Les articles qui n'ont aucun commentaire : id, titre.
SELECT id, titre FROM articles WHERE NOT EXISTS (
    SELECT 1 FROM commentaires WHERE commentaires.article_id = articles.id);

-- R4. Pour chaque auteur, le nombre total de commentaires recus sur ses articles,
--     du plus commente au moins commente.
SELECT ateliers.auteur, COUNT(commentaires.id) AS nb_commentaires FROM ateliers
JOIN articles a ON ateliers.atelier_id = ateliers.id LEFT JOIN commentaires ON commentaires.article_id = ateliers.id
GROUP BY ateliers.auteur ORDER BY nb_commentaires DESC;


-- R5. Les visiteurs (nom) qui ont commente plus d'un article.
SELECT nom FROM commmentaires GROUP BY nom  HAVING COUNT (DISTINCT article) > 1;

-- R6. Les trois commentaires les plus recents, avec le titre de leur article.
SELECT commentaires.nom, commentaires.texte, a.titre FROM commentaires
JOIN articles a ON commentaires.article_id = a.id ORDER BY c.cree_le DESC
LIMIT 3;
