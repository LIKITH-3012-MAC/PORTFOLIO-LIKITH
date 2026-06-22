import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { CollaborationPage } from './pages/CollaborationPage';
import { DataConsolePage } from './pages/DataConsolePage';
import { GitProfilePage } from './pages/GitProfilePage';
import { YouTubePage } from './pages/YouTubePage';
import { ProblemPage } from './pages/ProblemPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { QualityProvider } from './hooks/useAdaptive3DQuality';
import { MotionProvider } from './motion/MotionProvider';

export const App = () => {
  return (
    <QualityProvider>
      <Router>
        <MotionProvider>
          <Routes>
            {/* Main Layout containing persistent components and the global 3D Scene */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="collab" element={<CollaborationPage />} />
              <Route path="data" element={<DataConsolePage />} />
              <Route path="git-profile" element={<GitProfilePage />} />
              <Route path="youtube" element={<YouTubePage />} />
              <Route path="problem" element={<ProblemPage />} />
              
              {/* Legacy URL Backward Compatibility Redirects */}
              <Route path="index.html" element={<Navigate to="/" replace />} />
              <Route path="collab.html" element={<Navigate to="/collab" replace />} />
              <Route path="dataa.html" element={<Navigate to="/data" replace />} />
              <Route path="dataa" element={<Navigate to="/data" replace />} />
              <Route path="likith-git-profile.html" element={<Navigate to="/git-profile" replace />} />
              <Route path="likith-git-profile" element={<Navigate to="/git-profile" replace />} />
              <Route path="likith-youtube.html" element={<Navigate to="/youtube" replace />} />
              <Route path="likith-youtube" element={<Navigate to="/youtube" replace />} />
              <Route path="problem.html" element={<Navigate to="/problem" replace />} />
              
              {/* Catch-all Not Found Route */}
              <Route path="404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
          </Routes>
        </MotionProvider>
      </Router>
    </QualityProvider>
  );
};

export default App;
