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
 * /api/reservation:
 *   get:
 *     summary: Liste toutes les réservations
 *     tags:
 *       - reservation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations
 *   post:
 *     summary: Crée une réservation
 *     tags:
 *       - reservation
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
 *             properties:
 *               annonce_id:
 *                 type: integer
 *               statut:
 *                 type: string
 *                 example: "En_attente"
 *     responses:
 *       201:
 *         description: Réservation créée
 */
router.use(authenticateToken);

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('reservation').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { annonce_id, statut } = req.body || {};

  const { data, error } = await supabase
    .from('reservation')
    .insert({
      annonce_id,
      user_id: req.user.id,
      statut: statut ?? 'En_attente'
    })
    .select('*')
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * @openapi
 * /api/reservation/{id}:
 *   get:
 *     summary: Récupère une réservation par id
 *     tags:
 *       - reservation
 *   put:
 *     summary: Met à jour une réservation
 *     tags:
 *       - reservation
 *   delete:
 *     summary: Supprime une réservation
 *     tags:
 *       - reservation
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('reservation').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Réservation introuvable' });
  res.json(data);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  // Vérification propriétaire ou admin
  const { data: reservation, error: resError } = await supabase.from('reservation').select('user_id').eq('id', id).single();
  if (resError || !reservation) return res.status(404).json({ error: 'Réservation introuvable' });

  if (reservation.user_id !== req.user.id) {
    const { data: currentUser } = await supabase.from('utilisateur').select('is_admin').eq('id', req.user.id).single();
    if (!currentUser?.is_admin) return res.status(403).json({ error: 'Accès refusé' });
  }

  const updates = req.body || {};
  const { data, error } = await supabase.from('reservation').update(updates).eq('id', id).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { data: reservation, error: resError } = await supabase.from('reservation').select('user_id').eq('id', id).single();
  if (resError || !reservation) return res.status(404).json({ error: 'Réservation introuvable' });

  if (reservation.user_id !== req.user.id) {
    const { data: currentUser } = await supabase.from('utilisateur').select('is_admin').eq('id', req.user.id).single();
    if (!currentUser?.is_admin) return res.status(403).json({ error: 'Accès refusé' });
  }

  const { error } = await supabase.from('reservation').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });

  res.status(204).send();
});

module.exports = { reservationRouter: router };