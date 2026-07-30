import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import Home from './pages/Home.js';
import Auth from './pages/Auth.js';
import Profile from './pages/Profile.js';
import { useAuth } from './context/AuthContext.js';
import ReadJob from './components/jobs/ReadJob.js';
import JobManager from './pages/JobManager.js'; // Import JobManager component
import BrowseJobs from './pages/BrowseJobs.js'; // Import the new page
import JobDetail from './pages/JobDetail.js';
import ChatWidget from './components/chat/ChatWidget.js';
import EditProfile from './pages/EditProfile.js'; // Import EditProfile
import About from './pages/About.js';
import VideoGallery from './pages/VideoGallery.js'; // Import VideoGallery
import VideoPage from './pages/VideoPage.js'; // Import VideoPage
import VideoManager from './pages/VideoManager.js'; // Import VideoManager
import SocialMedia from './pages/SocialMedia.js'; // Import SocialMedia
import Forum from './pages/Forum.js'; // Import Forum
import ForumCategory from './pages/ForumCategory.js'; // Import ForumCategory
const App = () => {
  const { isLoggedIn } = useAuth(); // Use isLoggedIn to determine the user's status

  return (
    <Router>
      <div>
        <Navbar />
        <div>
          <Routes>
            {/* Render Home for both logged-in and logged-out users */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<ReadJob />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile/:userId" element={isLoggedIn ? <Profile /> : <Auth />} /> {/* Add dynamic Profile route */}
            <Route path="/jobmanager" element={<JobManager />} /> {/* Add JobManager route */}
            <Route path="/browse" element={<BrowseJobs />} /> {/* Add BrowseJobs route */}
            <Route path="/job/:jobId" element={<JobDetail />} /> {/* Add Job route */}
            <Route path="/editprofile" element={<EditProfile />} /> {/* Add EditProfile route */}
            <Route path="/about" element={<About />} /> {/* Add About route */}
            <Route path="/videos" element={<VideoGallery />} /> {/* Add VideoGallery route */}
            <Route path="/video/:id" element={<VideoPage />} /> {/* Add VideoPage route */}
            <Route path="/videomanager" element={<VideoManager />} /> {/* Add VideoManager route */}
            <Route path="/social" element={<SocialMedia />} /> {/* Add SocialMedia route */}
            <Route path="/forum" element={<Forum />} /> {/* Add Forum route */}
            <Route path="/forum/:groupId" element={<ForumCategory />} /> {/* Add ForumCategory route */}
          </Routes>
        </div>
        <ChatWidget /> {/* Include ChatWidget for chat functionality */}
      </div>
    </Router>
  );
};

export default App;
