import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminProvider } from '@/contexts/AdminContext';
import Header from '@/components/Header';
import ReportPage from '@/components/ReportPage';
import AreaPage from '@/components/AreaPage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('report');

  return (
    <AdminProvider>
      <div className="min-h-screen bg-background">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="container mx-auto px-6 py-10">
          <AnimatePresence mode="wait">
            {activeTab === 'report' ? (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ReportPage />
              </motion.div>
            ) : (
              <motion.div
                key="area"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AreaPage />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
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
