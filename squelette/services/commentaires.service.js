// SERVICE des commentaires · VERSION FICHIER JSON (celle de depart).
// Elle respecte le contrat (CONTRAT.md) : le cote API peut s'en servir tout de suite pour tester
// ses routes. Le cote base la remplace par une version PostgreSQL, avec les MEMES fonctions.
// Les articles, eux, sont deja dans PostgreSQL (services/articles.service.js).

const pool = require('../db/pool');
const ErreurHttp = require('../utils/erreur-http');
const articles = require('./articles.service');

const introuvable = (id) => new ErreurHttp(404, 'COMMENTAIRE_INTROUVABLE', `Le commentaire ${id} n'existe pas.`);

async function lister(articleId) {
  await articles.trouver(articleId);
  const query = 'SELECT * FROM commentaires WHERE article_id = $1 ORDER BY cree_le ASC';
  const { rows } = await pool.query(query, [articleId]);
  return rows;
}

async function trouver(id) {
  const query = 'SELECT * FROM commentaires WHERE id = $1';
  const { rows, rowCount } = await pool.query(query, [id]);
  if (rowCount === 0) throw introuvable(id);
  return rows[0];
}

async function parVisiteur(nom) {
  const query = `
    SELECT c.id, c.article_id, a.titre, c.texte, c.cree_le
    FROM commentaires c
    JOIN articles a ON c.article_id = a.id
    WHERE c.nom = $1
    ORDER BY c.cree_le DESC
  `;
  const { rows } = await pool.query(query, [nom]);
  return rows;
}

async function creer(articleId, { nom, texte }) {
  try {
    const query = `
      INSERT INTO commentaires (article_id, nom, texte)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [articleId, nom, texte]);
    return rows[0];
  } catch (err) {
    if (err.code === '23503') {
      throw new ErreurHttp(404, 'ARTICLE_INTROUVABLE', `L'article ${articleId} n'existe pas.`);
    }
    throw err;
  }
}

async function modifier(id, { texte }) {
  const query = `
    UPDATE commentaires
    SET texte = $1
    WHERE id = $2
    RETURNING *
  `;
  const { rows, rowCount } = await pool.query(query, [texte, id]);
  if (rowCount === 0) throw introuvable(id);
  return rows[0];
}

async function supprimer(id) {
  const query = 'DELETE FROM commentaires WHERE id = $1';
  const { rowCount } = await pool.query(query, [id]);
  if (rowCount === 0) throw introuvable(id);
}

module.exports = { lister, trouver, parVisiteur, creer, modifier, supprimer };