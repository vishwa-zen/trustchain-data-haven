
import { createRoot } from 'react-dom/client'
import { SidebarProvider } from '@/components/ui/sidebar'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

createRoot(rootElement).render(
  <SidebarProvider defaultOpen={true}>
    <App />
  </SidebarProvider>
);
