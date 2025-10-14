const express = require('express');
const { supabase } = require('../supabaseClient');
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware auth
const authenticateToken = async (req, res, next) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token manquant' });

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) return res.status(401).json({ error: 'Token invalide: ' + error.message });
    req.user = data.user;
    next();
  } catch {
    return res.status(401).json({ error: 'Erreur vérification token' });
  }
};

router.use(authenticateToken);

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
 *     summary: Upload une photo (profil ou annonce) et enregistre en DB
 *     tags:
 *       - photo
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               annonce_id:
 *                 type: integer
 *                 description: ID de l'annonce (laisser vide si photo de profil)
 *               type:
 *                 type: string
 *                 enum: ["Logement", "Profil"]
 *                 example: "Profil"
 *     responses:
 *       201:
 *         description: Photo uploadée et enregistrée
 */

/**
 * @openapi
 * /api/photo/annonce/{id}:
 *   get:
 *     summary: Récupère toutes les photos d'une annonce
 *     tags:
 *       - photo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des photos de l'annonce
 */

/**
 * @openapi
 * /api/photo/user/{id}:
 *   get:
 *     summary: Récupère la photo de profil d'un utilisateur
 *     tags:
 *       - photo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Photo(s) de profil
 */

/**
 * @openapi
 * /api/photo/{id}:
 *   get:
 *     summary: Récupère une photo par id
 *     tags:
 *       - photo
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Met à jour les métadonnées d'une photo
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
 *             properties:
 *               type:
 *                 type: string
 *               annonce_id:
 *                 type: integer
 *   delete:
 *     summary: Supprime une photo (DB + bucket)
 *     tags:
 *       - photo
 *     security:
 *       - bearerAuth: []
 */

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('photo').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/annonce/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('photo').select('*').eq('annonce_id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('photo').select('*').eq('user_id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', upload.single('file'), async (req, res) => {
  const { annonce_id, type } = req.body;
  
  if (!req.file) return res.status(400).json({ error: 'Fichier manquant' });
  
  // Validation du type
  const validTypes = ['Logement', 'Profil'];
  if (type && !validTypes.includes(type)) {
    return res.status(400).json({ error: 'Type doit être "Logement" ou "Profil"' });
  }
  
  // Si annonce_id est fourni, vérifier qu'elle existe
  if (annonce_id) {
    const { data: annonce, error: annonceError } = await supabase
      .from('annonce')
      .select('id')
      .eq('id', annonce_id)
      .single();
    
    if (annonceError || !annonce) {
      return res.status(400).json({ error: 'Annonce introuvable' });
    }
  }

  const fileName = `${req.user.id}/${Date.now()}-${req.file.originalname}`;
  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

  if (uploadError) return res.status(400).json({ error: uploadError.message });

  const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(fileName);

  const { data, error } = await supabase
    .from('photo')
    .insert({
      annonce_id: annonce_id || null,
      user_id: annonce_id ? null : req.user.id,
      url: publicUrl,
      type: type || (annonce_id ? 'Logement' : 'Profil'),
    })
    .select('*')
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('photo').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Photo introuvable' });
  res.json(data);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body || {};

  const { data: photo, error: photoError } = await supabase.from('photo').select('user_id').eq('id', id).single();
  if (photoError || !photo) return res.status(404).json({ error: 'Photo introuvable' });

  if (photo.user_id !== req.user.id) {
    const { data: currentUser } = await supabase.from('utilisateur').select('is_admin').eq('id', req.user.id).single();
    if (!currentUser?.is_admin) return res.status(403).json({ error: 'Accès refusé' });
  }

  const { data, error } = await supabase.from('photo').update(updates).eq('id', id).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { data: photo, error: photoError } = await supabase.from('photo').select('*').eq('id', id).single();
  if (photoError || !photo) return res.status(404).json({ error: 'Photo introuvable' });

  if (photo.user_id !== req.user.id) {
    const { data: currentUser } = await supabase.from('utilisateur').select('is_admin').eq('id', req.user.id).single();
    if (!currentUser?.is_admin) return res.status(403).json({ error: 'Accès refusé' });
  }

  const filePath = photo.url.split('/photos/')[1];
  if (filePath) {
    await supabase.storage.from('photos').remove([filePath]);
  }

  const { error } = await supabase.from('photo').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });

  res.status(204).send();
});

module.exports = { photoRouter: router };