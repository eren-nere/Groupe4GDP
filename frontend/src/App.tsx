import { useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Implement logic to check if user is authenticated
    navigate('/login');
  }, []);

  return <></>;
}

export default App;
