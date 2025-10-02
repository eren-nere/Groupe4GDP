import { Routes, Route } from 'react-router';
import App from '../App';
import LoginPage from '@pages/login';
import SignUpPage from '@pages/sign-up';
import FeedPage from '@pages/feed';
import Layout from '@components/layout';
import FavoritesPage from '@pages/favorites';
import ProfilePage from '@pages/profile';
import MessagesPage from '@pages/messages';
import AnnounceDetails from '@pages/announce-details';

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<App />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="sign-up" element={<SignUpPage />} />
      <Route element={<Layout />}>
        <Route path="feed" element={<FeedPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="announce-details" element={<AnnounceDetails />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
