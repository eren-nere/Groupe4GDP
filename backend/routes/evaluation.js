const express = require('express');
const { supabase } = require('../supabaseClient');

const router = express.Router();

// Middleware d'authentification
const authenticateToken = async (req, res, next) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase non configuré' });
  }

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Token d\'authentification manquant' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      return res.status(401).json({ error: 'Token invalide: ' + error.message });
    }
    req.user = data.user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Erreur de vérification du token' });
  }
};

/**
 * @openapi
 * /api/evaluation:
 *   get:
 *     summary: Liste toutes les évaluations
 *     tags:
 *       - evaluation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des évaluations
 *   post:
 *     summary: Crée une évaluation
 *     tags:
 *       - evaluation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - annonce_id
 *               - cible_id
 *               - note
 *             properties:
 *               annonce_id:
 *                 type: integer
 *               cible_id:
 *                 type: string
 *                 format: uuid
 *               commentaire:
 *                 type: string
 *               note:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Évaluation créée
 */
router.use(authenticateToken);

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('evaluation').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { annonce_id, cible_id, commentaire, note } = req.body || {};

  const { data, error } = await supabase
    .from('evaluation')
    .insert({
      annonce_id,
      auteur_id: req.user.id,
      cible_id,
      commentaire,
      note
    })
    .select('*')
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * @openapi
 * /api/evaluation/{id}:
 *   get:
 *     summary: Récupère une évaluation par id
 *     tags:
 *       - evaluation
 *   put:
 *     summary: Met à jour une évaluation
 *     tags:
 *       - evaluation
 *   delete:
 *     summary: Supprime une évaluation
 *     tags:
 *       - evaluation
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('evaluation').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Évaluation introuvable' });
  res.json(data);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  // Vérification auteur ou admin
  const { data: evaluation, error: evalError } = await supabase.from('evaluation').select('auteur_id').eq('id', id).single();
  if (evalError || !evaluation) return res.status(404).json({ error: 'Évaluation introuvable' });

  if (evaluation.auteur_id !== req.user.id) {
    const { data: currentUser } = await supabase.from('utilisateur').select('is_admin').eq('id', req.user.id).single();
    if (!currentUser?.is_admin) return res.status(403).json({ error: 'Accès refusé' });
  }

  const updates = req.body || {};
  const { data, error } = await supabase.from('evaluation').update(updates).eq('id', id).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { data: evaluation, error: evalError } = await supabase.from('evaluation').select('auteur_id').eq('id', id).single();
  if (evalError || !evaluation) return res.status(404).json({ error: 'Évaluation introuvable' });

  if (evaluation.auteur_id !== req.user.id) {
    const { data: currentUser } = await supabase.from('utilisateur').select('is_admin').eq('id', req.user.id).single();
    if (!currentUser?.is_admin) return res.status(403).json({ error: 'Accès refusé' });
  }

  const { error } = await supabase.from('evaluation').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });

  res.status(204).send();
});

module.exports = { evaluationRouter: router };