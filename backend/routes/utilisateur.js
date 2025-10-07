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
    
    // Ajouter les informations utilisateur à la requête
    req.user = data.user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Erreur de vérification du token' });
  }
};

/**
 * @openapi
 * /api/utilisateur:
 *   get:
 *     summary: Liste tous les profils
 *     description: Récupère la liste complète des utilisateurs enregistrés.
 *     operationId: listUtilisateurs
 *     tags:
 *       - utilisateur
 *     security:
 *       - bearerAuth: []
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
 *                     example: "john.doe@gmail.com"
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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
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
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "motdepasse123"
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
// Appliquer l'authentification à toutes les routes
router.use(authenticateToken);

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
  const { email, password, prenom, nom, date_naissance, bio, preferences } = req.body || {};

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (authError) {
    return res.status(400).json({ error: authError.message });
  }

  const id = authUser.user.id;

  const { data, error } = await supabase
    .from('utilisateur')
    .upsert({
      id,
      email,
      prenom: prenom ?? null,
      nom: nom ?? null,
      date_naissance: date_naissance ?? null,
      bio: bio ?? null,
      preferences: preferences ?? null
    })
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
 *     security:
 *       - bearerAuth: []
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
 *     description: Met à jour les informations du profil utilisateur correspondant à l'identifiant fourni. Seuls les administrateurs peuvent modifier d'autres profils, ou l'utilisateur peut modifier son propre profil.
 *     operationId: updateUtilisateur
 *     tags:
 *       - utilisateur
 *     security:
 *       - bearerAuth: []
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
 *       400:
 *         description: Erreur de validation ou de mise à jour
 *       403:
 *         description: Accès refusé - seuls les administrateurs peuvent modifier d'autres profils
 *       404:
 *         description: Profil introuvable
 *       500:
 *         description: Erreur interne du serveur
 *   delete:
 *     summary: Supprime un profil
 *     description: Supprime le profil utilisateur correspondant à l'identifiant fourni. Seuls les administrateurs peuvent supprimer d'autres profils, ou l'utilisateur peut supprimer son propre profil.
 *     operationId: deleteUtilisateur
 *     tags:
 *       - utilisateur
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
 *       204:
 *         description: Profil supprimé avec succès, aucune réponse retournée.
 *       400:
 *         description: Erreur lors de la suppression
 *       403:
 *         description: Accès refusé - seuls les administrateurs peuvent supprimer d'autres profils
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
  const currentUserId = req.user.id;
  
  // Vérifier si l'utilisateur peut modifier ce profil (admin ou son propre compte)
  if (id !== currentUserId) {
    // Vérifier si l'utilisateur actuel est admin
    const { data: currentUser, error: currentUserError } = await supabase
      .from('utilisateur')
      .select('is_admin')
      .eq('id', currentUserId)
      .single();
    
    if (currentUserError || !currentUser?.is_admin) {
      return res.status(403).json({ error: 'Accès refusé : seuls les administrateurs peuvent modifier d\'autres profils' });
    }
  }
  
  const updates = req.body || {};
  
  // Mettre à jour le profil existant
  const { data: updated, error: updateError } = await supabase
    .from('utilisateur')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (updateError) {
    return res.status(400).json({ error: updateError.message });
  }

  if (!updated) {
    return res.status(404).json({ error: 'Profil introuvable' });
  }

  return res.json(updated);
});

router.delete('/:id', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  const { id } = req.params;
  const currentUserId = req.user.id;
  
  // Vérifier si l'utilisateur peut supprimer ce profil (admin ou son propre compte)
  if (id !== currentUserId) {
    // Vérifier si l'utilisateur actuel est admin
    const { data: currentUser, error: currentUserError } = await supabase
      .from('utilisateur')
      .select('is_admin')
      .eq('id', currentUserId)
      .single();
    
    if (currentUserError || !currentUser?.is_admin) {
      return res.status(403).json({ error: 'Accès refusé : seuls les administrateurs peuvent supprimer d\'autres profils' });
    }
  }
  
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