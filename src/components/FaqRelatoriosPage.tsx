import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import AnalystCard from '@/components/AnalystCard';
import ReportCard from '@/components/ReportCard';
import ReportDetailModal from '@/components/ReportDetailModal';

const FaqRelatoriosPage = () => {
  const { content, isAdmin, updateSetting, addReport } = useAdmin();
  const [selectedAnalystId, setSelectedAnalystId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const filteredReports = selectedAnalystId
    ? content.reports.filter((r) => r.creator_id === selectedAnalystId)
    : content.reports;

  const getCreatorName = (id: string | null) => content.analysts.find((a) => a.id === id)?.name || 'Desconhecido';

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
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-primary blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            FAQ dos Relatórios
          </h2>
          <p className="text-accent text-lg font-medium mb-6">Métricas e detalhes dos nossos relatórios</p>
          {isAdmin ? (
            <textarea
              className="text-primary-foreground/80 leading-relaxed text-lg bg-transparent border border-primary-foreground/10 rounded-lg p-3 w-full min-h-[100px] outline-none focus:border-accent"
              value={content.faqDescription}
              onChange={(e) => updateSetting('faqDescription', e.target.value)}
            />
          ) : (
            <p className="text-primary-foreground/80 leading-relaxed text-lg">
              {content.faqDescription}
            </p>
          )}
        </div>
      </motion.section>

      {/* Analyst cards as filters */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h3 className="text-2xl font-display font-bold text-foreground mb-6">Nossa Equipe</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.analysts.map((analyst, i) => (
            <AnalystCard
              key={analyst.id}
              analyst={analyst}
              index={i}
              isSelected={selectedAnalystId === analyst.id}
              onClick={() => setSelectedAnalystId(selectedAnalystId === analyst.id ? null : analyst.id)}
              showDetails={false}
            />
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
          <h3 className="text-2xl font-display font-bold text-foreground">
            Relatórios{selectedAnalystId ? ` de ${getCreatorName(selectedAnalystId)}` : ''}{' '}
            <span className="text-muted-foreground text-lg font-normal">({filteredReports.length})</span>
          </h3>
          {isAdmin && (
            <button
              onClick={() =>
                addReport({
                  name: 'Novo Relatório',
                  creator_id: selectedAnalystId || content.analysts[0]?.id || null,
                  description: 'Descrição do relatório.',
                  images: [],
                  metrics: ['Métrica: valor'],
                  sort_order: content.reports.length + 1,
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
                creatorName={getCreatorName(report.creator_id)}
                index={i}
                onClick={() => setSelectedReportId(report.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Report detail modal (with metrics) */}
      <AnimatePresence>
        {selectedReport && (
          <ReportDetailModal
            report={selectedReport}
            creatorName={getCreatorName(selectedReport.creator_id)}
            onClose={() => setSelectedReportId(null)}
            showMetrics
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FaqRelatoriosPage;
