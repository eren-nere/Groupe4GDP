const express = require('express');
const { supabase } = require('../supabaseClient');

const router = express.Router();

/**
 * @openapi
 * /api/profiles:
 *   get:
 *     summary: Liste tous les profils
 *     tags: [Profiles]
 *     responses:
 *       200:
 *         description: Liste des profils
 *   post:
 *     summary: Crée un profil
 *     tags: [Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               username:
 *                 type: string
 *               full_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Profil créé
 */
router.get('/', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

router.post('/', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  const { id, username, full_name, ...rest } = req.body || {};
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id, username, full_name, ...rest }])
    .select('*')
    .single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json(data);
});

/**
 * @openapi
 * /api/profiles/{id}:
 *   get:
 *     summary: Récupère un profil par id
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profil trouvé
 *       404:
 *         description: Profil introuvable
 *   put:
 *     summary: Met à jour un profil
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *   delete:
 *     summary: Supprime un profil
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Profil supprimé
 */
router.get('/:id', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  const { id } = req.params;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Profil introuvable' });
    }
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

router.put('/:id', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  const { id } = req.params;
  const updates = req.body || {};
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  const { id } = req.params;
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(204).send();
});

module.exports = { profilesRouter: router };


