import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import AnalystCard from '@/components/AnalystCard';
import ReportCard from '@/components/ReportCard';
import ReportDetailModal from '@/components/ReportDetailModal';

const RelatoriosCriadosPage = () => {
  const { content, isAdmin, updateContent, addReport } = useAdmin();
  const [selectedAnalystId, setSelectedAnalystId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const filteredReports = selectedAnalystId
    ? content.reports.filter((r) => r.creatorId === selectedAnalystId)
    : content.reports;

  const getCreatorName = (id: string) => content.analysts.find((a) => a.id === id)?.name || 'Desconhecido';

  const selectedReport = content.reports.find((r) => r.id === selectedReportId);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-2xl gradient-navy p-10 md:p-16"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            Relatórios Criados
          </h2>
          {isAdmin ? (
            <textarea
              className="text-primary-foreground/80 leading-relaxed text-lg bg-transparent border border-primary-foreground/10 rounded-lg p-3 w-full min-h-[80px] outline-none focus:border-accent"
              value={content.portfolioDescription}
              onChange={(e) => updateContent({ portfolioDescription: e.target.value })}
            />
          ) : (
            <p className="text-primary-foreground/80 leading-relaxed text-lg">
              {content.portfolioDescription}
            </p>
          )}
        </div>
      </motion.section>

      {/* Analyst filter */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h3 className="text-xl font-display font-bold text-foreground mb-4">Filtrar por Analista</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedAnalystId(null)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              !selectedAnalystId ? 'gradient-accent text-accent-foreground' : 'glass-card text-foreground hover:shadow-lg'
            }`}
          >
            Todos
          </button>
          {content.analysts.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedAnalystId(selectedAnalystId === a.id ? null : a.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedAnalystId === a.id ? 'gradient-accent text-accent-foreground' : 'glass-card text-foreground hover:shadow-lg'
              }`}
            >
              <div className="w-6 h-6 rounded-full overflow-hidden bg-muted shrink-0">
                {a.photo ? <img src={a.photo} alt="" className="w-full h-full object-cover" /> : <User className="w-full h-full p-1 text-muted-foreground" />}
              </div>
              {a.name}
            </button>
          ))}
        </div>
      </motion.section>

      {/* Reports grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-bold text-foreground">
            {filteredReports.length} relatório{filteredReports.length !== 1 ? 's' : ''}
          </h3>
          {isAdmin && (
            <button
              onClick={() =>
                addReport({
                  id: Date.now().toString(),
                  name: 'Novo Relatório',
                  creatorId: content.analysts[0]?.id || '',
                  description: 'Descrição do relatório.',
                  images: [],
                  metrics: [],
                })
              }
              className="px-4 py-2 rounded-lg gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredReports.map((report, i) => (
              <ReportCard
                key={report.id}
                report={report}
                creatorName={getCreatorName(report.creatorId)}
                index={i}
                onClick={() => setSelectedReportId(report.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Report detail modal (no metrics) */}
      <AnimatePresence>
        {selectedReport && (
          <ReportDetailModal
            report={selectedReport}
            creatorName={getCreatorName(selectedReport.creatorId)}
            onClose={() => setSelectedReportId(null)}
            showMetrics={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RelatoriosCriadosPage;
