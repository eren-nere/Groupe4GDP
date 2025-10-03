const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Routes d'authentification
 */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } }) : null;

/**
 * @openapi
 * /api/auth/magic-link:
 *   post:
 *     summary: Envoi d'un lien magique par email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               redirectTo:
 *                 type: string
 *                 description: URL de redirection après connexion
 *     responses:
 *       200:
 *         description: Lien envoyé si l'email est valide
 *       400:
 *         description: Erreur de validation
 */
// Magic link (envoi du mail)
router.post('/magic-link', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  const { email, redirectTo } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email requis' });
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

/**
 * @openapi
 * /api/auth/sign-in:
 *   post:
 *     summary: Connexion par email/mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Session créée
 *       400:
 *         description: Erreur de validation ou d'authentification
 */
router.post('/sign-in', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email et password requis' });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

/**
 * @openapi
 * /api/auth/sign-up:
 *   post:
 *     summary: Inscription par email/mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur créé (vérification email possible)
 *       400:
 *         description: Erreur de validation
 */
router.post('/sign-up', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email et password requis' });
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

/**
 * @openapi
 * /api/auth/user:
 *   get:
 *     summary: Récupère l'utilisateur courant via Bearer token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations utilisateur
 *       401:
 *         description: Non autorisé / Token invalide
 */
router.get('/user', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token manquant' });
  const { data, error } = await supabase.auth.getUser(token);
  if (error) return res.status(401).json({ error: error.message });
  return res.json(data);
});

/**
 * @openapi
 * /api/auth/sign-out:
 *   post:
 *     summary: Déconnexion (stateless côté serveur)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Succès
 */
router.post('/sign-out', async (req, res) => {
  // Sign-out côté client en supprimant le token local. Ici, on renvoie simplement 200.
  return res.json({ success: true });
});

module.exports = { authRouter: router };


