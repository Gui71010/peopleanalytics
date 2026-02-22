import { motion } from 'framer-motion';
import { Pencil, Trash2, User } from 'lucide-react';
import { Analyst, useAdmin } from '@/contexts/AdminContext';

interface AnalystCardProps {
  analyst: Analyst;
  index: number;
  isSelected?: boolean;
  onClick?: () => void;
  showDetails?: boolean;
  editable?: boolean;
}

const AnalystCard = ({ analyst, index, isSelected, onClick, showDetails, editable }: AnalystCardProps) => {
  const { isAdmin, updateAnalyst, removeAnalyst } = useAdmin();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08 }}
      onClick={onClick}
      className={`glass-card rounded-xl p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl ${
        isSelected ? 'ring-2 ring-accent shadow-xl shadow-accent/10' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-muted flex items-center justify-center">
          {analyst.photo ? (
            <img src={analyst.photo} alt={analyst.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-lg text-foreground truncate">{analyst.name}</h4>
          <p className="text-sm text-muted-foreground">{analyst.role}</p>
          <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
            {analyst.area}
          </span>
        </div>
      </div>

      {/* Expanded details */}
      {showDetails && isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-border"
        >
          {isAdmin && editable ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Nome</label>
                <input className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm" value={analyst.name} onChange={(e) => updateAnalyst(analyst.id, { name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Cargo</label>
                <input className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm" value={analyst.role} onChange={(e) => updateAnalyst(analyst.id, { role: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Área</label>
                <input className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm" value={analyst.area} onChange={(e) => updateAnalyst(analyst.id, { area: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">URL da Foto</label>
                <input className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm" value={analyst.photo} onChange={(e) => updateAnalyst(analyst.id, { photo: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Bio</label>
                <textarea className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm min-h-[60px]" value={analyst.bio} onChange={(e) => updateAnalyst(analyst.id, { bio: e.target.value })} />
              </div>
              <button onClick={(e) => { e.stopPropagation(); removeAnalyst(analyst.id); }} className="text-destructive text-sm hover:underline flex items-center gap-1">
                <Trash2 className="w-3 h-3" /> Remover analista
              </button>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm leading-relaxed">{analyst.bio}</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnalystCard;
