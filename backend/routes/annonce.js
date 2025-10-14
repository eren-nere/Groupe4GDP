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

/**
 * @openapi
 * /api/annonce/search/disponibilite:
 *   get:
 *     summary: Recherche des annonces par disponibilité
 *     description: |
 *       Récupère les annonces disponibles selon une plage de dates. Au moins un paramètre de date doit être fourni.
 *       - Si les deux dates sont fournies : retourne les annonces dont la période de disponibilité englobe toute la période recherchée
 *       - Si seule date_debut est fournie : retourne les annonces disponibles à partir de cette date
 *       - Si seule date_fin est fournie : retourne les annonces disponibles jusqu'à cette date
 *     operationId: searchAnnoncesByDisponibilite
 *     tags:
 *       - annonce
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date_debut
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         description: Date de début de la période souhaitée (format YYYY-MM-DD). Au moins date_debut ou date_fin est requis.
 *       - in: query
 *         name: date_fin
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-15"
 *         description: Date de fin de la période souhaitée (format YYYY-MM-DD). Ne peut pas être antérieure à date_debut. Au moins date_debut ou date_fin est requis.
 *     responses:
 *       200:
 *         description: Liste des annonces disponibles pendant la période spécifiée
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
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   adresse_id:
 *                     type: integer
 *                     example: 5
 *                   titre:
 *                     type: string
 *                     example: "Jardin urbain disponible"
 *                   description:
 *                     type: string
 *                     example: "Beau jardin en centre-ville"
 *                   superficie:
 *                     type: integer
 *                     example: 50
 *                   equipements:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["arrosage", "serre"]
 *                   date_debut:
 *                     type: string
 *                     format: date
 *                     example: "2023-12-01"
 *                   date_fin:
 *                     type: string
 *                     format: date
 *                     example: "2024-03-31"
 *                   statut:
 *                     type: string
 *                     example: "Disponible"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                   adresse:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 5
 *                       rue:
 *                         type: string
 *                         example: "123 Rue de la Paix"
 *                       ville:
 *                         type: string
 *                         example: "Paris"
 *                       code_postal:
 *                         type: string
 *                         example: "75001"
 *                       pays:
 *                         type: string
 *                         example: "France"
 *                       latitude:
 *                         type: number
 *                         format: float
 *                         example: 48.8566
 *                       longitude:
 *                         type: number
 *                         format: float
 *                         example: 2.3522
 *                       arrondissement:
 *                         type: string
 *                         example: "1er"
 *       400:
 *         description: Paramètres manquants ou invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   examples:
 *                     missing_params:
 *                       value: "Au moins un paramètre date_debut ou date_fin est requis"
 *                     invalid_date_format:
 *                       value: "Le format de date_debut est invalide (format attendu: YYYY-MM-DD)"
 *                     date_order:
 *                       value: "La date_fin ne peut pas être antérieure à la date_debut"
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/search/disponibilite', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  
  const { date_debut, date_fin } = req.query;
  
  // Au moins une date doit être fournie
  if (!date_debut && !date_fin) {
    return res.status(400).json({ error: 'Au moins un paramètre date_debut ou date_fin est requis' });
  }

  // Valider que les dates sont bien formatées
  if (date_debut && isNaN(Date.parse(date_debut))) {
    return res.status(400).json({ error: 'Le format de date_debut est invalide (format attendu: YYYY-MM-DD)' });
  }
  if (date_fin && isNaN(Date.parse(date_fin))) {
    return res.status(400).json({ error: 'Le format de date_fin est invalide (format attendu: YYYY-MM-DD)' });
  }

  // Valider que date_fin n'est pas avant date_debut
  if (date_debut && date_fin && new Date(date_fin) < new Date(date_debut)) {
    return res.status(400).json({ error: 'La date_fin ne peut pas être antérieure à la date_debut' });
  }

  try {
    // Construire la requête en fonction des paramètres fournis
    let query = supabase
      .from('annonce')
      .select('*, adresse(*)')
      .eq('statut', 'Disponible');

    if (date_debut && date_fin) {
      // Les deux dates : annonces qui couvrent toute la période
      query = query.lte('date_debut', date_debut).gte('date_fin', date_fin);
    } else if (date_debut) {
      // Seulement date_debut : annonces disponibles à partir de cette date
      query = query.gte('date_fin', date_debut);
    } else if (date_fin) {
      // Seulement date_fin : annonces disponibles jusqu'à cette date
      query = query.lte('date_debut', date_fin);
    }

    const { data, error } = await query;

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des annonces' });
  }
});

/**
 * @openapi
 * /api/annonce/search/proximite:
 *   get:
 *     summary: Recherche des annonces par proximité
 *     description: Récupère toutes les annonces triées par distance par rapport aux coordonnées GPS fournies (du plus proche au plus loin). La distance est calculée en kilomètres avec la formule de Haversine.
 *     operationId: searchAnnoncesByProximite
 *     tags:
 *       - annonce
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *           example: 48.8566
 *         description: Latitude de référence (en degrés décimaux)
 *       - in: query
 *         name: long
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *           example: 2.3522
 *         description: Longitude de référence (en degrés décimaux)
 *     responses:
 *       200:
 *         description: Liste des annonces triées par distance croissante
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
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   adresse_id:
 *                     type: integer
 *                     example: 5
 *                   titre:
 *                     type: string
 *                     example: "Jardin urbain disponible"
 *                   description:
 *                     type: string
 *                     example: "Beau jardin en centre-ville"
 *                   superficie:
 *                     type: integer
 *                     example: 50
 *                   equipements:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["arrosage", "serre"]
 *                   date_debut:
 *                     type: string
 *                     format: date
 *                     example: "2023-12-01"
 *                   date_fin:
 *                     type: string
 *                     format: date
 *                     example: "2024-03-31"
 *                   statut:
 *                     type: string
 *                     example: "Disponible"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                   adresse:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 5
 *                       rue:
 *                         type: string
 *                         example: "123 Rue de la Paix"
 *                       ville:
 *                         type: string
 *                         example: "Paris"
 *                       code_postal:
 *                         type: string
 *                         example: "75001"
 *                       pays:
 *                         type: string
 *                         example: "France"
 *                       latitude:
 *                         type: number
 *                         format: float
 *                         example: 48.8566
 *                       longitude:
 *                         type: number
 *                         format: float
 *                         example: 2.3522
 *                       arrondissement:
 *                         type: string
 *                         example: "1er"
 *                   distance:
 *                     type: number
 *                     format: float
 *                     example: 2.45
 *                     description: Distance en kilomètres par rapport au point de référence
 *       400:
 *         description: Paramètres manquants ou invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Les paramètres lat et long sont requis"
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/search/proximite', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  
  const { lat, long } = req.query;
  
  if (!lat || !long) {
    return res.status(400).json({ error: 'Les paramètres lat et long sont requis' });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(long);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Les coordonnées doivent être des nombres valides' });
  }

  try {
    // Récupérer toutes les annonces avec leurs adresses
    const { data, error } = await supabase
      .from('annonce')
      .select('*, adresse(*)');

    if (error) return res.status(500).json({ error: error.message });

    // Calculer la distance pour chaque annonce et trier
    const annoncesAvecDistance = data
      .filter(annonce => annonce.adresse && annonce.adresse.latitude && annonce.adresse.longitude)
      .map(annonce => {
        const distance = calculerDistance(
          latitude,
          longitude,
          annonce.adresse.latitude,
          annonce.adresse.longitude
        );
        return { ...annonce, distance };
      })
      .sort((a, b) => a.distance - b.distance);

    res.json(annoncesAvecDistance);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des annonces' });
  }
});

/**
 * @openapi
 * /api/annonce/search/disponibilite-proximite:
 *   get:
 *     summary: Recherche des annonces par disponibilité et proximité
 *     description: |
 *       Récupère les annonces disponibles selon une plage de dates ET triées par distance par rapport aux coordonnées GPS fournies. 
 *       Les coordonnées GPS sont obligatoires, mais au moins un paramètre de date doit être fourni.
 *       - Si les deux dates sont fournies : retourne les annonces dont la période de disponibilité englobe toute la période recherchée
 *       - Si seule date_debut est fournie : retourne les annonces disponibles à partir de cette date
 *       - Si seule date_fin est fournie : retourne les annonces disponibles jusqu'à cette date
 *       Les résultats sont triés du plus proche au plus loin.
 *     operationId: searchAnnoncesByDisponibiliteProximite
 *     tags:
 *       - annonce
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date_debut
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         description: Date de début de la période souhaitée (format YYYY-MM-DD). Au moins date_debut ou date_fin est requis.
 *       - in: query
 *         name: date_fin
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-15"
 *         description: Date de fin de la période souhaitée (format YYYY-MM-DD). Ne peut pas être antérieure à date_debut. Au moins date_debut ou date_fin est requis.
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *           example: 48.8566
 *         description: Latitude de référence (en degrés décimaux)
 *       - in: query
 *         name: long
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *           example: 2.3522
 *         description: Longitude de référence (en degrés décimaux)
 *     responses:
 *       200:
 *         description: Liste des annonces disponibles pendant la période spécifiée, triées par distance croissante
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
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   adresse_id:
 *                     type: integer
 *                     example: 5
 *                   titre:
 *                     type: string
 *                     example: "Jardin urbain disponible"
 *                   description:
 *                     type: string
 *                     example: "Beau jardin en centre-ville"
 *                   superficie:
 *                     type: integer
 *                     example: 50
 *                   equipements:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["arrosage", "serre"]
 *                   date_debut:
 *                     type: string
 *                     format: date
 *                     example: "2023-12-01"
 *                   date_fin:
 *                     type: string
 *                     format: date
 *                     example: "2024-03-31"
 *                   statut:
 *                     type: string
 *                     example: "Disponible"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                   adresse:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 5
 *                       rue:
 *                         type: string
 *                         example: "123 Rue de la Paix"
 *                       ville:
 *                         type: string
 *                         example: "Paris"
 *                       code_postal:
 *                         type: string
 *                         example: "75001"
 *                       pays:
 *                         type: string
 *                         example: "France"
 *                       latitude:
 *                         type: number
 *                         format: float
 *                         example: 48.8566
 *                       longitude:
 *                         type: number
 *                         format: float
 *                         example: 2.3522
 *                       arrondissement:
 *                         type: string
 *                         example: "1er"
 *                   distance:
 *                     type: number
 *                     format: float
 *                     example: 2.45
 *                     description: Distance en kilomètres par rapport au point de référence
 *       400:
 *         description: Paramètres manquants ou invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   examples:
 *                     missing_coords:
 *                       value: "Les paramètres lat et long sont requis"
 *                     missing_dates:
 *                       value: "Au moins un paramètre date_debut ou date_fin est requis"
 *                     invalid_coords:
 *                       value: "Les coordonnées doivent être des nombres valides"
 *                     invalid_date_format:
 *                       value: "Le format de date_debut est invalide (format attendu: YYYY-MM-DD)"
 *                     date_order:
 *                       value: "La date_fin ne peut pas être antérieure à la date_debut"
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/search/disponibilite-proximite', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' });
  
  const { date_debut, date_fin, lat, long } = req.query;
  
  // Vérifier les coordonnées GPS (obligatoires)
  if (!lat || !long) {
    return res.status(400).json({ error: 'Les paramètres lat et long sont requis' });
  }

  // Au moins une date doit être fournie
  if (!date_debut && !date_fin) {
    return res.status(400).json({ error: 'Au moins un paramètre date_debut ou date_fin est requis' });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(long);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Les coordonnées doivent être des nombres valides' });
  }

  // Valider que les dates sont bien formatées
  if (date_debut && isNaN(Date.parse(date_debut))) {
    return res.status(400).json({ error: 'Le format de date_debut est invalide (format attendu: YYYY-MM-DD)' });
  }
  if (date_fin && isNaN(Date.parse(date_fin))) {
    return res.status(400).json({ error: 'Le format de date_fin est invalide (format attendu: YYYY-MM-DD)' });
  }

  // Valider que date_fin n'est pas avant date_debut
  if (date_debut && date_fin && new Date(date_fin) < new Date(date_debut)) {
    return res.status(400).json({ error: 'La date_fin ne peut pas être antérieure à la date_debut' });
  }

  try {
    // Construire la requête en fonction des paramètres fournis
    let query = supabase
      .from('annonce')
      .select('*, adresse(*)')
      .eq('statut', 'Disponible');

    if (date_debut && date_fin) {
      // Les deux dates : annonces qui couvrent toute la période
      query = query.lte('date_debut', date_debut).gte('date_fin', date_fin);
    } else if (date_debut) {
      // Seulement date_debut : annonces disponibles à partir de cette date
      query = query.gte('date_fin', date_debut);
    } else if (date_fin) {
      // Seulement date_fin : annonces disponibles jusqu'à cette date
      query = query.lte('date_debut', date_fin);
    }

    const { data, error } = await query;

    if (error) return res.status(500).json({ error: error.message });

    // Calculer la distance pour chaque annonce et trier
    const annoncesAvecDistance = data
      .filter(annonce => annonce.adresse && annonce.adresse.latitude && annonce.adresse.longitude)
      .map(annonce => {
        const distance = calculerDistance(
          latitude,
          longitude,
          annonce.adresse.latitude,
          annonce.adresse.longitude
        );
        return { ...annonce, distance };
      })
      .sort((a, b) => a.distance - b.distance);

    res.json(annoncesAvecDistance);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des annonces' });
  }
});

// Fonction utilitaire pour calculer la distance entre deux points GPS (formule de Haversine)
function calculerDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en kilomètres
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance en kilomètres
  
  return distance;
}

module.exports = { annonceRouter: router };