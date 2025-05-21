
import { createRoot } from 'react-dom/client'
import { SidebarProvider } from '@/components/ui/sidebar'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <SidebarProvider defaultOpen={true}>
    <App />
  </SidebarProvider>
);
