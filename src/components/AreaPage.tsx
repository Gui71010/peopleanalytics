import { motion } from 'framer-motion';
import { useAdmin } from '@/contexts/AdminContext';
import hierarquiaImage from '@/assets/hierarquia.png';

const teamMembers = [
  { name: 'Rogerio Aguiar', role: 'Gerente de Pessoas', squad: '', isLead: true },
  { name: 'Allyson Nunes', role: 'Analista de BI', squad: 'Treinamento' },
  { name: 'Alessa Kettney', role: 'Analista de BI', squad: 'Medicina e Business Partner' },
  { name: 'Guilherme Santiago', role: 'Analista de BI', squad: 'Recrutamento e Seleção' },
  { name: 'Matheus Wilson', role: 'Analista de BI', squad: 'Corporativo' },
  { name: 'Souza Júnior', role: 'Designer Gráfico', squad: '' },
];

const AreaPage = () => {
  const { content, isAdmin, updateContent } = useAdmin();

  return (
    <div className="space-y-16">
      {/* Intro */}
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

      {/* Org Chart Image */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="glass-card rounded-2xl p-4 overflow-hidden"
      >
        <h3 className="text-2xl font-display font-bold text-foreground mb-4 px-4 pt-2">
          Organograma da Equipe
        </h3>
        <img
          src={hierarquiaImage}
          alt="Hierarquia do Setor"
          className="w-full rounded-xl"
        />
      </motion.section>

      {/* Team Cards */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h3 className="text-2xl font-display font-bold text-foreground mb-6">Membros da Equipe</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className={`glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                member.isLead ? 'sm:col-span-2 lg:col-span-3 gradient-navy text-primary-foreground' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-display font-bold ${
                    member.isLead
                      ? 'gradient-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h4 className={`font-display font-semibold text-lg ${member.isLead ? '' : 'text-foreground'}`}>
                    {member.name}
                  </h4>
                  <p className={`text-sm ${member.isLead ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {member.role}
                  </p>
                  {member.squad && (
                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                      {member.squad}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Report Carousel */}
      {content.reportSlides.length > 0 && <ReportCarousel />}
    </div>
  );
};

// Carousel for report images in area page
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ReportCarousel = () => {
  const { content, isAdmin, updateSlide, removeSlide, addSlide } = useAdmin();
  const slides = content.reportSlides;
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((p) => (p + 1) % slides.length);
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-display font-bold text-foreground">
          Relatórios Produzidos
        </h3>
        {isAdmin && (
          <button
            onClick={() =>
              addSlide({
                id: Date.now().toString(),
                image: '',
                title: 'Novo Relatório',
                description: 'Descrição do relatório',
              })
            }
            className="px-4 py-2 rounded-lg gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition"
          >
            + Adicionar Slide
          </button>
        )}
      </div>

      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-center gap-6">
          <button
            onClick={prev}
            className="shrink-0 w-12 h-12 rounded-full gradient-navy flex items-center justify-center text-primary-foreground hover:opacity-80 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {isAdmin ? (
                <>
                  <div className="space-y-3">
                    <label className="text-xs text-muted-foreground">URL da Imagem</label>
                    <input
                      className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm"
                      placeholder="Cole a URL da imagem"
                      value={slides[current]?.image || ''}
                      onChange={(e) => updateSlide(slides[current].id, { image: e.target.value })}
                    />
                  </div>
                  <input
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground font-display font-semibold text-lg"
                    value={slides[current]?.title || ''}
                    onChange={(e) => updateSlide(slides[current].id, { title: e.target.value })}
                  />
                  <textarea
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground min-h-[80px] text-sm"
                    value={slides[current]?.description || ''}
                    onChange={(e) => updateSlide(slides[current].id, { description: e.target.value })}
                  />
                  <button
                    onClick={() => {
                      removeSlide(slides[current].id);
                      setCurrent(0);
                    }}
                    className="text-destructive text-sm hover:underline"
                  >
                    Remover este slide
                  </button>
                </>
              ) : (
                <>
                  {slides[current]?.image && (
                    <img
                      src={slides[current].image}
                      alt={slides[current].title}
                      className="w-full rounded-xl max-h-96 object-contain"
                    />
                  )}
                  <h4 className="text-xl font-display font-semibold text-foreground">
                    {slides[current]?.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {slides[current]?.description}
                  </p>
                </>
              )}
            </motion.div>
          </div>

          <button
            onClick={next}
            className="shrink-0 w-12 h-12 rounded-full gradient-navy flex items-center justify-center text-primary-foreground hover:opacity-80 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === current ? 'bg-accent w-8' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default AreaPage;
