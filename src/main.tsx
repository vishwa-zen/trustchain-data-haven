
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

createRoot(rootElement).render(
  <StrictMode>
    <SidebarProvider defaultOpen={true}>
      <App />
    </SidebarProvider>
  </StrictMode>
);
