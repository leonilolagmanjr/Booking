import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';
import ReadJob from './components/jobs/ReadJob';
import JobManager from './pages/JobManager';
import BrowseJobs from './pages/BrowseJobs';
import JobDetail from './pages/JobDetail';
import ChatWidget from './components/chat/ChatWidget';
import EditProfile from './pages/EditProfile';
import About from './pages/About';
import VideoGallery from './pages/VideoGallery';
import VideoPage from './pages/VideoPage';
import VideoManager from './pages/VideoManager';
import SocialMedia from './pages/SocialMedia';
import Forum from './pages/Forum.jsx';
import ForumCategory from './pages/ForumCategory.jsx';

const App = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <div>
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<ReadJob />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile/:userId" element={isLoggedIn ? <Profile /> : <Auth />} />
            <Route path="/jobmanager" element={<JobManager />} />
            <Route path="/browse" element={<BrowseJobs />} />
            <Route path="/job/:jobId" element={<JobDetail />} />
            <Route path="/editprofile" element={<EditProfile />} />
            <Route path="/about" element={<About />} />
            <Route path="/videos" element={<VideoGallery />} />
            <Route path="/video/:id" element={<VideoPage />} />
            <Route path="/videomanager" element={<VideoManager />} />
            <Route path="/social" element={<SocialMedia />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:groupId" element={<ForumCategory />} />
          </Routes>
        </div>
        <ChatWidget />
      </div>
    </Router>
  );
};

export default App;