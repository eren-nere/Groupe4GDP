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
 * /api/message:
 *   get:
 *     summary: Liste les messages de l'utilisateur connecté (ou tous si admin)
 *     tags:
 *       - message
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des messages
 *   post:
 *     summary: Envoie un message
 *     tags:
 *       - message
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
 *               - destinataire_id
 *               - contenu
 *             properties:
 *               annonce_id:
 *                 type: integer
 *               destinataire_id:
 *                 type: string
 *                 format: uuid
 *               contenu:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message envoyé
 */
router.use(authenticateToken);

router.get('/', async (req, res) => {
  let query = supabase.from('message').select('*');

  // Vérif admin
  const { data: currentUser } = await supabase.from('utilisateur').select('is_admin').eq('id', req.user.id).single();

  if (!currentUser?.is_admin) {
    query = query.or(`expediteur_id.eq.${req.user.id},destinataire_id.eq.${req.user.id}`);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { annonce_id, destinataire_id, contenu } = req.body || {};

  const { data, error } = await supabase
    .from('message')
    .insert({
      annonce_id,
      expediteur_id: req.user.id,
      destinataire_id,
      contenu
    })
    .select('*')
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * @openapi
 * /api/message/{id}:
 *   get:
 *     summary: Récupère un message par id
 *     tags:
 *       - message
 *   put:
 *     summary: Met à jour le contenu d'un message
 *     tags:
 *       - message
 *   delete:
 *     summary: Supprime un message
 *     tags:
 *       - message
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('message').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Message introuvable' });

  // Vérif visibilité : expéditeur ou destinataire ou admin
  if (data.expediteur_id !== req.user.id && data.destinataire_id !== req.user.id) {
    const { data: currentUser } = await supabase.from('utilisateur').select('is_admin').eq('id', req.user.id).single();
    if (!currentUser?.is_admin) return res.status(403).json({ error: 'Accès refusé' });
  }

  res.json(data);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { contenu } = req.body || {};

  const { data: message, error: msgError } = await supabase.from('message').select('expediteur_id').eq('id', id).single();
  if (msgError || !message) return res.status(404).json({ error: 'Message introuvable' });

  if (message.expediteur_id !== req.user.id) {
    const { data: currentUser } = await supabase.from('utilisateur').select('is_admin').eq('id', req.user.id).single();
    if (!currentUser?.is_admin) return res.status(403).json({ error: 'Accès refusé' });
  }

  const { data, error } = await supabase.from('message').update({ contenu }).eq('id', id).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { data: message, error: msgError } = await supabase.from('message').select('expediteur_id').eq('id', id).single();
  if (msgError || !message) return res.status(404).json({ error: 'Message introuvable' });

  if (message.expediteur_id !== req.user.id) {
    const { data: currentUser } = await supabase.from('utilisateur').select('is_admin').eq('id', req.user.id).single();
    if (!currentUser?.is_admin) return res.status(403).json({ error: 'Accès refusé' });
  }

  const { error } = await supabase.from('message').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });

  res.status(204).send();
});

module.exports = { messageRouter: router };