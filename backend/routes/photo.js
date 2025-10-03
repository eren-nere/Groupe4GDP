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
 * /api/photo:
 *   get:
 *     summary: Liste toutes les photos
 *     tags:
 *       - photo
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des photos
 *   post:
 *     summary: Ajoute une photo
 *     tags:
 *       - photo
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
 *               - url
 *               - type
 *             properties:
 *               annonce_id:
 *                 type: integer
 *               url:
 *                 type: string
 *               type:
 *                 type: string
 *                 example: "Principale"
 *     responses:
 *       201:
 *         description: Photo créée
 */
router.use(authenticateToken);

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('photo').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { annonce_id, url, type } = req.body || {};

  const { data, error } = await supabase
    .from('photo')
    .insert({
      annonce_id,
      user_id: req.user.id,
      url,
      type
    })
    .select('*')
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * @openapi
 * /api/photo/{id}:
 *   get:
 *     summary: Récupère une photo par id
 *     tags:
 *       - photo
 *   put:
 *     summary: Met à jour une photo
 *     tags:
 *       - photo
 *   delete:
 *     summary: Supprime une photo
 *     tags:
 *       - photo
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('photo').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Photo introuvable' });
  res.json(data);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  // Vérification propriétaire ou admin
  const { data: photo, error: photoError } = await supabase.from('photo').select('user_id').eq('id', id).single();
  if (photoError || !photo) return res.status(404).json({ error: 'Photo introuvable' });

  if (photo.user_id !== req.user.id) {
    const { data: currentUser } = await supabase.from('utilisateur').select('is_admin').eq('id', req.user.id).single();
    if (!currentUser?.is_admin) return res.status(403).json({ error: 'Accès refusé' });
  }

  const updates = req.body || {};
  const { data, error } = await supabase.from('photo').update(updates).eq('id', id).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { data: photo, error: photoError } = await supabase.from('photo').select('user_id').eq('id', id).single();
  if (photoError || !photo) return res.status(404).json({ error: 'Photo introuvable' });

  if (photo.user_id !== req.user.id) {
    const { data: currentUser } = await supabase.from('utilisateur').select('is_admin').eq('id', req.user.id).single();
    if (!currentUser?.is_admin) return res.status(403).json({ error: 'Accès refusé' });
  }

  const { error } = await supabase.from('photo').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });

  res.status(204).send();
});

module.exports = { photoRouter: router };