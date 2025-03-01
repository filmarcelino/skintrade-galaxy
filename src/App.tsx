
import { Route, Routes } from 'react-router-dom';

import Index from '@/pages/Index';
import Marketplace from '@/pages/Marketplace';
import Inventory from '@/pages/Inventory';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Make Inventory the initial route */}
      <Route path="/" element={<Inventory />} />
      <Route path="/dashboard" element={<Index />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
