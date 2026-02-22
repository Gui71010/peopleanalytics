import { motion } from 'framer-motion';
import { BarChart3, Users, TrendingUp, FileCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import dashboardImage from '@/assets/dashboard-report.png';

const stats = [
  { icon: Users, label: 'Inscritos Vaga', value: '10.691' },
  { icon: TrendingUp, label: 'Aprovados', value: '10.428' },
  { icon: FileCheck, label: 'Doc Aprovado', value: '4.294' },
  { icon: BarChart3, label: 'Assinatura Contrato', value: '3.566' },
];

const ReportPage = () => {
  const { content, isAdmin, updateContent } = useAdmin();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = content.reportSlides;

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);

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
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-primary blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-3xl">
          {isAdmin ? (
            <input
              className="text-4xl md:text-5xl font-display font-bold text-primary-foreground bg-transparent border-b border-primary-foreground/20 w-full mb-2 outline-none focus:border-accent"
              value={content.heroTitle}
              onChange={(e) => updateContent({ heroTitle: e.target.value })}
            />
          ) : (
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-2">
              {content.heroTitle}
            </h2>
          )}
          <p className="text-accent text-xl font-medium mb-6">{content.heroSubtitle}</p>
          {isAdmin ? (
            <textarea
              className="text-primary-foreground/80 leading-relaxed text-lg bg-transparent border border-primary-foreground/10 rounded-lg p-3 w-full min-h-[120px] outline-none focus:border-accent"
              value={content.reportDescription}
              onChange={(e) => updateContent({ reportDescription: e.target.value })}
            />
          ) : (
            <p className="text-primary-foreground/80 leading-relaxed text-lg">
              {content.reportDescription}
            </p>
          )}
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="glass-card rounded-xl p-6 text-center hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg gradient-accent flex items-center justify-center">
              <stat.icon className="w-6 h-6 text-accent-foreground" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Dashboard Image */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="glass-card rounded-2xl p-4 overflow-hidden"
      >
        <img
          src={dashboardImage}
          alt="Dashboard do Relatório"
          className="w-full rounded-xl"
        />
      </motion.section>

      {/* Carousel */}
      {slides.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h3 className="text-2xl font-display font-bold text-foreground mb-6">
            Detalhes do Relatório
          </h3>
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center gap-6">
              <button
                onClick={prevSlide}
                className="shrink-0 w-12 h-12 rounded-full gradient-navy flex items-center justify-center text-primary-foreground hover:opacity-80 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex-1 min-w-0">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                >
                  {slides[currentSlide]?.image && (
                    <img
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].title}
                      className="w-full rounded-xl mb-6 max-h-96 object-contain"
                    />
                  )}
                  <h4 className="text-xl font-display font-semibold text-foreground mb-2">
                    {slides[currentSlide]?.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {slides[currentSlide]?.description}
                  </p>
                </motion.div>
              </div>

              <button
                onClick={nextSlide}
                className="shrink-0 w-12 h-12 rounded-full gradient-navy flex items-center justify-center text-primary-foreground hover:opacity-80 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'bg-accent w-8' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default ReportPage;
