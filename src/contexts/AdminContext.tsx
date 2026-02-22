import React, { createContext, useContext, useState, useCallback } from 'react';

interface ReportSlide {
  id: string;
  image: string;
  title: string;
  description: string;
}

interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  reportDescription: string;
  areaDescription: string;
  reportSlides: ReportSlide[];
}

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  content: SiteContent;
  updateContent: (content: Partial<SiteContent>) => void;
  addSlide: (slide: ReportSlide) => void;
  updateSlide: (id: string, slide: Partial<ReportSlide>) => void;
  removeSlide: (id: string) => void;
}

const DEFAULT_CONTENT: SiteContent = {
  heroTitle: 'Gestão Candidato SOU',
  heroSubtitle: 'Funil Admissional',
  reportDescription:
    'Este relatório foi desenvolvido pela equipe de Business Intelligence da Diretoria de Pessoas para acompanhar todo o fluxo admissional dos candidatos. Através dele, é possível monitorar métricas essenciais como inscritos na vaga, registros no ATS, aprovações, pré-admissão, documentação e assinatura de contrato. O dashboard fornece uma visão gerencial completa com filtros por ano, cidade, produto e modalidade, permitindo análises detalhadas por região e etapa do processo.',
  areaDescription:
    'Nossa área de Business Intelligence atua dentro da Diretoria de Pessoas, sendo responsável por transformar dados em insights estratégicos para a tomada de decisão. A equipe é composta por analistas especializados em diferentes squads, cada um focado em uma vertical do negócio.',
  reportSlides: [
    {
      id: '1',
      image: '',
      title: 'Visão Gerencial',
      description:
        'Painel principal com indicadores-chave do funil admissional: inscritos na vaga, inclusão, registro ATS, aprovados, pré-admissão, virados ADM, doc aprovado e assinatura de contrato.',
    },
    {
      id: '2',
      image: '',
      title: 'Vagas Admissionais por Cidade',
      description:
        'Análise comparativa do volume de vagas admissionais distribuídas por cidade, permitindo identificar as regiões com maior demanda.',
    },
    {
      id: '3',
      image: '',
      title: 'Volume x Perda por Etapa',
      description:
        'Funil de conversão mostrando a perda percentual em cada etapa do processo admissional, desde inscritos até assinatura de contrato.',
    },
  ],
};

const ADMIN_PASSWORD = 'Guisantos88';

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('admin_auth') === 'true';
  });

  const [content, setContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('site_content');
    return saved ? JSON.parse(saved) : DEFAULT_CONTENT;
  });

  const saveContent = useCallback((c: SiteContent) => {
    setContent(c);
    localStorage.setItem('site_content', JSON.stringify(c));
  }, []);

  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem('admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('admin_auth');
  };

  const updateContent = (partial: Partial<SiteContent>) => {
    saveContent({ ...content, ...partial });
  };

  const addSlide = (slide: ReportSlide) => {
    saveContent({ ...content, reportSlides: [...content.reportSlides, slide] });
  };

  const updateSlide = (id: string, partial: Partial<ReportSlide>) => {
    saveContent({
      ...content,
      reportSlides: content.reportSlides.map((s) => (s.id === id ? { ...s, ...partial } : s)),
    });
  };

  const removeSlide = (id: string) => {
    saveContent({
      ...content,
      reportSlides: content.reportSlides.filter((s) => s.id !== id),
    });
  };

  return (
    <AdminContext.Provider
      value={{ isAdmin, login, logout, content, updateContent, addSlide, updateSlide, removeSlide }}
    >
      {children}
    </AdminContext.Provider>
  );
};
