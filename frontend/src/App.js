import React, { useState, useEffect } from 'react';
import './App.css';
import { api } from './lib/api';
import MagicLinkAuth from './components/MagicLinkAuth';
import ClassicAuth from './components/ClassicAuth';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Si redirection magic link: récupérer access_token depuis l'URL hash
      if (window && window.location && window.location.hash) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessTokenFromHash = params.get('access_token');
        if (accessTokenFromHash) {
          localStorage.setItem('access_token', accessTokenFromHash);
          // nettoyer l'URL
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
        }
      }

      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const sessionData = await api.getSession(token);
          const userId = sessionData?.user?.id;
          setSession(sessionData);
          if (userId) {
            localStorage.setItem('access_token', sessionData.access_token);
            fetchProfile(userId);
          }
        } catch (e) {
          localStorage.removeItem('access_token');
          setSession(null);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchProfile = async (userId) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn('Pas de token encore disponible');
      return;
    }
    try {
      const data = await api.getProfile(userId);
      setProfile(data);
      setIsProfileComplete(Boolean(data?.nom && data?.prenom));
    } catch (error) {
      console.error('Erreur profil:', error);
      setProfile(null);
      setIsProfileComplete(false);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (nom, prenom) => {
    await api.updateProfile(session.user.id, {
      nom,
      prenom,
      updated_at: new Date().toISOString(),
    });
    fetchProfile(session.user.id);
  };

  const handleLogout = async () => {
    try { await api.signOut(); } catch (e) {}
    localStorage.removeItem('access_token');
    setSession(null);
    setProfile(null);
    setIsProfileComplete(false);
  };

  if (session) {
    return (
      <div className="App">
        <MagicLinkAuth 
          session={session} 
          profile={profile} 
          loading={loading} 
          isProfileComplete={isProfileComplete}
          updateProfile={updateProfile}
          handleLogout={handleLogout}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <MagicLinkAuth 
        session={session} 
        profile={profile} 
        loading={loading} 
        isProfileComplete={isProfileComplete}
        updateProfile={updateProfile}
        handleLogout={handleLogout}
      />
      <div style={{ marginTop: '40px' }}>
        <ClassicAuth 
          session={session} 
          profile={profile} 
          loading={loading} 
          isProfileComplete={isProfileComplete}
          updateProfile={updateProfile}
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
}

export default App;
