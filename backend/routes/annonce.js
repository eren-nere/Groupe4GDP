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
 * /api/annonce:
 *   get:
 *     summary: Liste toutes les annonces
 *     description: Récupère la liste complète des annonces.
 *     operationId: listAnnonces
 *     tags:
 *       - annonce
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des annonces
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   user_id:
 *                     type: string
 *                     format: uuid
 *                   adresse_id:
 *                     type: integer
 *                   titre:
 *                     type: string
 *                   description:
 *                     type: string
 *                   superficie:
 *                     type: integer
 *                   equipements:
 *                     type: array
 *                     items:
 *                       type: string
 *                   date_debut:
 *                     type: string
 *                     format: date
 *                   date_fin:
 *                     type: string
 *                     format: date
 *                   statut:
 *                     type: string
 *                     example: "Disponible"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Erreur interne du serveur
 *   post:
 *     summary: Crée une annonce
 *     description: Crée une nouvelle annonce à partir des informations fournies.
 *     operationId: createAnnonce
 *     tags:
 *       - annonce
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - statut
 *             properties:
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               superficie:
 *                 type: integer
 *               equipements:
 *                 type: array
 *                 items:
 *                   type: string
 *               date_debut:
 *                 type: string
 *                 format: date
 *               date_fin:
 *                 type: string
 *                 format: date
 *               adresse_id:
 *                 type: integer
 *               statut:
 *                 type: string
 *                 example: "Disponible"
 *     responses:
 *       201:
 *         description: Annonce créée
 *       400:
 *         description: Erreur de validation ou de création
 *       500:
 *         description: Erreur interne du serveur
 */
router.use(authenticateToken);

router.get('/', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  const { data, error } = await supabase.from('annonce').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  const { titre, description, superficie, equipements, date_debut, date_fin, adresse_id, statut } = req.body || {};

  const { data, error } = await supabase
    .from('annonce')
    .insert({
      user_id: req.user.id,
      titre,
      description,
      superficie,
      equipements,
      date_debut,
      date_fin,
      adresse_id,
      statut: statut ?? 'Disponible'
    })
    .select('*')
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * @openapi
 * /api/annonce/{id}:
 *   get:
 *     summary: Récupère une annonce par id
 *     tags:
 *       - annonce
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Annonce trouvée
 *       404:
 *         description: Annonce introuvable
 *   put:
 *     summary: Met à jour une annonce
 *     tags:
 *       - annonce
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Annonce mise à jour
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Annonce introuvable
 *   delete:
 *     summary: Supprime une annonce
 *     tags:
 *       - annonce
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Supprimée avec succès
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Annonce introuvable
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('annonce').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Annonce introuvable' });
  res.json(data);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  // Vérifier que l'utilisateur est propriétaire ou admin
  const { data: annonce, error: annonceError } = await supabase.from('annonce').select('user_id').eq('id', id).single();
  if (annonceError || !annonce) return res.status(404).json({ error: 'Annonce introuvable' });

  if (annonce.user_id !== req.user.id) {
    const { data: currentUser } = await supabase.from('utilisateur').select('is_admin').eq('id', req.user.id).single();
    if (!currentUser?.is_admin) return res.status(403).json({ error: 'Accès refusé' });
  }

  const updates = req.body || {};
  const { data, error } = await supabase.from('annonce').update(updates).eq('id', id).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { data: annonce, error: annonceError } = await supabase.from('annonce').select('user_id').eq('id', id).single();
  if (annonceError || !annonce) return res.status(404).json({ error: 'Annonce introuvable' });

  if (annonce.user_id !== req.user.id) {
    const { data: currentUser } = await supabase.from('utilisateur').select('is_admin').eq('id', req.user.id).single();
    if (!currentUser?.is_admin) return res.status(403).json({ error: 'Accès refusé' });
  }

  const { error } = await supabase.from('annonce').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });

  res.status(204).send();
});

module.exports = { annonceRouter: router };