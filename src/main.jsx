import React from 'react';
import { createRoot } from 'react-dom/client';
import JobPortalApp from './JobPortalApp';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <JobPortalApp />
  </React.StrictMode>
);
