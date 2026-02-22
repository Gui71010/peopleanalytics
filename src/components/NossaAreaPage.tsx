import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import hierarquiaImage from '@/assets/hierarquia.png';
import AnalystCard from '@/components/AnalystCard';

const NossaAreaPage = () => {
  const { content, isAdmin, updateContent, addAnalyst } = useAdmin();
  const [selectedAnalyst, setSelectedAnalyst] = useState<string | null>(null);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-2xl gradient-navy p-10 md:p-16"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/2 w-80 h-80 rounded-full bg-teal blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            Nossa Área
          </h2>
          <p className="text-accent text-lg font-medium mb-6">Equipe de Business Intelligence</p>
          {isAdmin ? (
            <textarea
              className="text-primary-foreground/80 leading-relaxed text-lg bg-transparent border border-primary-foreground/10 rounded-lg p-3 w-full min-h-[100px] outline-none focus:border-accent"
              value={content.areaDescription}
              onChange={(e) => updateContent({ areaDescription: e.target.value })}
            />
          ) : (
            <p className="text-primary-foreground/80 leading-relaxed text-lg">
              {content.areaDescription}
            </p>
          )}
        </div>
      </motion.section>

      {/* Org Chart */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="glass-card rounded-2xl p-4 overflow-hidden"
      >
        <h3 className="text-2xl font-display font-bold text-foreground mb-4 px-4 pt-2">
          Organograma da Equipe
        </h3>
        <img src={hierarquiaImage} alt="Hierarquia do Setor" className="w-full rounded-xl" />
      </motion.section>

      {/* Team Cards */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-display font-bold text-foreground">Membros da Equipe</h3>
          {isAdmin && (
            <button
              onClick={() =>
                addAnalyst({
                  id: Date.now().toString(),
                  name: 'Novo Analista',
                  role: 'Analista de BI',
                  area: 'Nova Área',
                  photo: '',
                  bio: 'Descrição do analista.',
                })
              }
              className="px-4 py-2 rounded-lg gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.analysts.map((analyst, i) => (
            <AnalystCard
              key={analyst.id}
              analyst={analyst}
              index={i}
              isSelected={selectedAnalyst === analyst.id}
              onClick={() => setSelectedAnalyst(selectedAnalyst === analyst.id ? null : analyst.id)}
              showDetails
              editable
            />
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default NossaAreaPage;
