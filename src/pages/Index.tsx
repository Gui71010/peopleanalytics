import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminProvider } from '@/contexts/AdminContext';
import Header from '@/components/Header';
import NossaAreaPage from '@/components/NossaAreaPage';
import RelatoriosCriadosPage from '@/components/RelatoriosCriadosPage';
import FaqRelatoriosPage from '@/components/FaqRelatoriosPage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('area');

  const renderPage = () => {
    switch (activeTab) {
      case 'area':
        return <NossaAreaPage />;
      case 'portfolio':
        return <RelatoriosCriadosPage />;
      case 'faq':
        return <FaqRelatoriosPage />;
      default:
        return <NossaAreaPage />;
    }
  };

  return (
    <AdminProvider>
      <div className="min-h-screen bg-background">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="w-full px-6 lg:px-10 py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="gradient-navy mt-20 py-8 text-center">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Diretoria de Pessoas — Business Intelligence
          </p>
        </footer>
      </div>
    </AdminProvider>
  );
};

export default Index;
