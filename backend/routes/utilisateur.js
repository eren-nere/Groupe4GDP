const express = require('express');
const { supabase } = require('../supabaseClient');

const router = express.Router();

/**
 * @openapi
 * /api/utilisateur:
 *   get:
 *     summary: Liste tous les profils
 *     description: Récupère la liste complète des utilisateurs enregistrés.
 *     operationId: listUtilisateurs
 *     tags:
 *       - utilisateur
 *     responses:
 *       200:
 *         description: Liste des profils
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 required:
 *                   - id
 *                   - email
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   nom:
 *                     type: string
 *                     example: "Doe"
 *                   prenom:
 *                     type: string
 *                     example: "John"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "john.doe@example.com"
 *                   date_naissance:
 *                     type: string
 *                     format: date
 *                     example: "1995-08-15"
 *                   bio:
 *                     type: string
 *                     example: "Développeur passionné de Node.js"
 *                   preferences:
 *                     type: string
 *                     example: "{\"theme\": \"dark\", \"lang\": \"fr\"}"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-10-03T12:34:56Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-10-03T15:45:22Z"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *   post:
 *     summary: Crée un profil
 *     description: Crée un nouvel utilisateur à partir des informations fournies.
 *     operationId: createUtilisateur
 *     tags:
 *       - utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - email
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               prenom:
 *                 type: string
 *                 example: "John"
 *               nom:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               date_naissance:
 *                 type: string
 *                 format: date
 *                 example: "1995-08-15"
 *               bio:
 *                 type: string
 *                 example: "Développeur passionné"
 *               preferences:
 *                 type: string
 *                 example: "{\"theme\": \"dark\"}"
 *     responses:
 *       201:
 *         description: Profil créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 prenom:
 *                   type: string
 *                 nom:
 *                   type: string
 *                 email:
 *                   type: string
 *                 date_naissance:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 preferences:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Erreur de validation ou de création
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  const { data, error } = await supabase.from('utilisateur').select('*');
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

router.post('/', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  const { id, prenom, nom, ...rest } = req.body || {};
  const { data, error } = await supabase
    .from('utilisateur')
    .insert({ id, prenom, nom, ...rest })
    .select('*')
    .single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json(data);
});

/**
 * @openapi
 * /api/utilisateur/{id}:
 *   get:
 *     summary: Récupère un profil par id
 *     description: Retourne les informations du profil utilisateur correspondant à l'identifiant fourni.
 *     operationId: getUtilisateurById
 *     tags:
 *       - utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant unique de l'utilisateur
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Profil trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nom:
 *                   type: string
 *                 prenom:
 *                   type: string
 *                 email:
 *                   type: string
 *                 date_naissance:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 preferences:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Profil introuvable
 *       500:
 *         description: Erreur interne du serveur
 *   put:
 *     summary: Met à jour un profil
 *     description: Met à jour les informations du profil utilisateur correspondant à l'identifiant fourni. Si l'utilisateur n'existe pas, il sera créé (upsert).
 *     operationId: updateUtilisateur
 *     tags:
 *       - utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               date_naissance:
 *                 type: string
 *                 format: date
 *               bio:
 *                 type: string
 *               preferences:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       201:
 *         description: Profil créé suite à un upsert
 *       400:
 *         description: Erreur de validation ou de mise à jour
 *       500:
 *         description: Erreur interne du serveur
 *   delete:
 *     summary: Supprime un profil
 *     description: Supprime le profil utilisateur correspondant à l'identifiant fourni.
 *     operationId: deleteUtilisateur
 *     tags:
 *       - utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Profil supprimé avec succès, aucune réponse retournée.
 *       400:
 *         description: Erreur lors de la suppression
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/:id', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  const { id } = req.params;
  const { data, error } = await supabase
    .from('utilisateur')
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
  const { data: updated, error: updateError } = await supabase
    .from('utilisateur')
    .update(updates)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (updateError) {
    return res.status(400).json({ error: updateError.message });
  }

  if (updated) {
    return res.json(updated);
  }

  const { data: userAdmin, error: adminError } = await supabase.auth.admin.getUserById(id);
  if (adminError) {
    return res.status(400).json({ error: `Impossible de récupérer l'email: ${adminError.message}` });
  }
  const email = userAdmin?.user?.email;
  if (!email) {
    return res.status(400).json({ error: "Email introuvable pour cet utilisateur" });
  }

  const toInsert = { id, email, ...updates };
  const { data: created, error: insertError } = await supabase
    .from('utilisateur')
    .insert(toInsert)
    .select('*')
    .single();

  if (insertError) {
    return res.status(400).json({ error: insertError.message });
  }

  return res.status(201).json(created);
});

router.delete('/:id', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  const { id } = req.params;
  const { error } = await supabase
    .from('utilisateur')
    .delete()
    .eq('id', id);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(204).send();
});

module.exports = { utilisateurRouter: router };