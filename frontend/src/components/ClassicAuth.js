import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import './ClassicAuth.css';

// Si compte
const UserProfile = ({ profile, session, loading, handleLogout }) => (
  <div className="profile-container">
    <h2>Profil Utilisateur</h2>
    
    {loading ? (
      <p>Chargement...</p>
    ) : (
      <>
        <div className="profile-info">
          <p><strong>Prénom:</strong> {profile?.prenom}</p>
          <p><strong>Nom:</strong> {profile?.nom}</p>
          <p><strong>Email:</strong> {session?.user?.email}</p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="logout-button"
        >
          Se déconnecter
        </button>
      </>
    )}
  </div>
);

// Si !compte
const ProfileForm = ({ nom, setNom, prenom, setPrenom, loading, updateProfile }) => (
  <div className="profile-form-container">
    <h2>Complétez votre profil</h2>
    <p>Veuillez renseigner ces informations pour continuer</p>
    
    <form onSubmit={updateProfile}>
      <div className="form-group">
        <label htmlFor="prenom">Prénom</label>
        <input
          id="prenom"
          type="text"
          placeholder="Votre prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="nom">Nom</label>
        <input
          id="nom"
          type="text"
          placeholder="Votre nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading || !nom || !prenom}
        className="auth-button"
      >
        {loading ? 'Enregistrement...' : "Enregistrer"}
      </button>
    </form>
  </div>
);

// Formulaire de connexion classique
const LoginForm = ({ email, setEmail, password, setPassword, loading, handleLogin, isSignUp, toggleMode }) => (
  <>
    <h2>{isSignUp ? 'Inscription' : 'Connexion'}</h2>
    <p>{isSignUp ? 'Créez votre compte avec email et mot de passe' : 'Connectez-vous avec votre email et mot de passe'}</p>
    
    <form onSubmit={handleLogin}>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          placeholder="Votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading || !email || !password}
        className="auth-button"
      >
        {loading ? (isSignUp ? 'Inscription...' : 'Connexion...') : (isSignUp ? 'S\'inscrire' : 'Se connecter')}
      </button>
    </form>
    
    <div className="auth-switch">
      <p>
        {isSignUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
        <button 
          type="button" 
          onClick={toggleMode}
          className="switch-button"
        >
          {isSignUp ? 'Se connecter' : 'S\'inscrire'}
        </button>
      </p>
    </div>
  </>
);

const ClassicAuth = ({ session, profile, loading, isProfileComplete, updateProfile, handleLogout }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');

  // Remplir les champs avec les données existantes
  useEffect(() => {
    if (profile) {
      setNom(profile.nom || '');
      setPrenom(profile.prenom || '');
    }
  }, [profile]);

  // Créer ou mettre à jour le profil utilisateur
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!nom || !prenom) {
      setError('Tous les champs sont obligatoires');
      return;
    }
    
    try {
      setMessage('');
      setError('');
      
      await updateProfile(nom, prenom);
      setMessage('Profil mis à jour avec succès!');
    } catch (error) {
      setError(error.message);
    }
  };

  // Gère la connexion/inscription classique
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setMessage('');
      setError('');
      
      if (isSignUp) {
        await api.signUp(email, password);
        setMessage('Compte créé ! Vérifiez votre email pour confirmer votre inscription.');
      } else {
        const data = await api.signIn(email, password);
        const accessToken = data?.session?.access_token || data?.access_token;
        if (accessToken) {
          localStorage.setItem('access_token', accessToken);
        }
        setMessage('Connexion réussie !');
      }
    } catch (error) {
      setError(error.error_description || error.message);
    }
  };

  // Bascule entre connexion et inscription
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setMessage('');
  };

  // Ne pas afficher le composant si l'utilisateur est connecté
  if (session) {
    return null;
  }

  return (
    <>
    <div className="auth-container">
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <LoginForm 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loading={loading}
        handleLogin={handleLogin}
        isSignUp={isSignUp}
        toggleMode={toggleMode}
      />
    </div>
    </>
  );
};

export default ClassicAuth;
