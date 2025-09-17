import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import './MagicLinkAuth.css';

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

// Formulaire de connexion
const LoginForm = ({ email, setEmail, loading, handleLogin }) => (
  <>
    <h2>Connexion par Magic Link</h2>
    <p>Entrez votre email pour recevoir un lien de connexion</p>
    
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
      
      <button 
        type="submit" 
        disabled={loading || !email}
        className="auth-button"
      >
        {loading ? 'Envoi en cours...' : 'Envoyer le lien magique'}
      </button>
    </form>
  </>
);

const MagicLinkAuth = ({ session, profile, loading, isProfileComplete, updateProfile, handleLogout }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
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

  // Gère la connexion par magic link 
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setMessage('');
      setError('');
      await api.signInWithOtp(email, window.location.origin);
      
      setMessage('Vérifiez votre email pour le lien de connexion!');
    } catch (error) {
      setError(error.message);
    }
  };
  


  return (
    <>
    <div className="auth-container">
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      {!session ? (
        <LoginForm 
          email={email}
          setEmail={setEmail}
          loading={loading}
          handleLogin={handleLogin}
        />
      ) : loading ? (
        <p>Chargement...</p>
      ) : isProfileComplete ? (
        <UserProfile 
          profile={profile}
          session={session}
          loading={loading}
          handleLogout={handleLogout}
        />
      ) : (
        <ProfileForm 
          nom={nom}
          setNom={setNom}
          prenom={prenom}
          setPrenom={setPrenom}
          loading={loading}
          updateProfile={handleUpdateProfile}
        />
      )}
    </div>
    </>
  );
};

export default MagicLinkAuth;
