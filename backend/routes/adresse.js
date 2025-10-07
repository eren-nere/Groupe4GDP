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
 * /api/adresse:
 *   get:
 *     summary: Liste toutes les adresses
 *     tags:
 *       - adresse
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des adresses
 *   post:
 *     summary: Crée une adresse
 *     tags:
 *       - adresse
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rue
 *               - ville
 *               - code_postal
 *               - pays
 *             properties:
 *               rue:
 *                 type: string
 *               ville:
 *                 type: string
 *               code_postal:
 *                 type: string
 *               pays:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               arrondissement:
 *                 type: string
 *     responses:
 *       201:
 *         description: Adresse créée
 */
router.use(authenticateToken);

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('adresse').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { rue, ville, code_postal, pays, latitude, longitude, arrondissement } = req.body || {};

  const { data, error } = await supabase
    .from('adresse')
    .insert({
      rue,
      ville,
      code_postal,
      pays,
      latitude,
      longitude,
      arrondissement
    })
    .select('*')
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * @openapi
 * /api/adresse/{id}:
 *   get:
 *     summary: Récupère une adresse par id
 *     tags:
 *       - adresse
 *   put:
 *     summary: Met à jour une adresse
 *     tags:
 *       - adresse
 *   delete:
 *     summary: Supprime une adresse
 *     tags:
 *       - adresse
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('adresse').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Adresse introuvable' });
  res.json(data);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  // Vérification admin uniquement (pas de user_id dans adresse)
  const { data: currentUser } = await supabase.from('utilisateur').select('is_admin').eq('id', req.user.id).single();
  if (!currentUser?.is_admin) return res.status(403).json({ error: 'Accès refusé' });

  const updates = req.body || {};
  const { data, error } = await supabase.from('adresse').update(updates).eq('id', id).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // Vérification admin uniquement
  const { data: currentUser } = await supabase.from('utilisateur').select('is_admin').eq('id', req.user.id).single();
  if (!currentUser?.is_admin) return res.status(403).json({ error: 'Accès refusé' });

  const { error } = await supabase.from('adresse').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });

  res.status(204).send();
});

module.exports = { adresseRouter: router };