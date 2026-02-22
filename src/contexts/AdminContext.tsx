import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Analyst {
  id: string;
  name: string;
  role: string;
  area: string;
  photo: string;
  bio: string;
}

export interface Report {
  id: string;
  name: string;
  creatorId: string;
  description: string;
  images: string[];
  metrics: string[];
}

interface SiteContent {
  areaDescription: string;
  faqDescription: string;
  portfolioDescription: string;
  analysts: Analyst[];
  reports: Report[];
}

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  content: SiteContent;
  updateContent: (content: Partial<SiteContent>) => void;
  addAnalyst: (analyst: Analyst) => void;
  updateAnalyst: (id: string, data: Partial<Analyst>) => void;
  removeAnalyst: (id: string) => void;
  addReport: (report: Report) => void;
  updateReport: (id: string, data: Partial<Report>) => void;
  removeReport: (id: string) => void;
}

const DEFAULT_CONTENT: SiteContent = {
  areaDescription:
    'Nossa área de Business Intelligence atua dentro da Diretoria de Pessoas, sendo responsável por transformar dados em insights estratégicos para a tomada de decisão. A equipe é composta por analistas especializados em diferentes squads, cada um focado em uma vertical do negócio.',
  faqDescription:
    'Bem-vindo ao FAQ dos Relatórios! Aqui você pode explorar as métricas de cada relatório criado pelo nosso time de dados. Selecione um analista para filtrar os relatórios por responsável e clique em qualquer relatório para ver seus detalhes e métricas.',
  portfolioDescription:
    'Conheça todos os relatórios produzidos pela nossa equipe de Business Intelligence. Selecione um analista para filtrar ou navegue por todo o portfólio.',
  analysts: [
    { id: '1', name: 'Allyson Nunes', role: 'Analista de BI', area: 'Treinamento', photo: '', bio: 'Responsável pelos relatórios de treinamento e desenvolvimento de pessoas.' },
    { id: '2', name: 'Alessa Kettney', role: 'Analista de BI', area: 'Medicina e Business Partner', photo: '', bio: 'Responsável pelos relatórios de medicina ocupacional e atuação como Business Partner.' },
    { id: '3', name: 'Guilherme Santiago', role: 'Analista de BI', area: 'Recrutamento e Seleção', photo: '', bio: 'Responsável pelos relatórios de recrutamento, seleção e funil admissional.' },
    { id: '4', name: 'Matheus Wilson', role: 'Analista de BI', area: 'Corporativo', photo: '', bio: 'Responsável pelos relatórios corporativos e indicadores estratégicos.' },
  ],
  reports: [
    { id: '1', name: 'Gestão Candidato SOU', creatorId: '3', description: 'Funil admissional completo com métricas de inscritos, aprovados e contratados.', images: [], metrics: ['Inscritos Vaga: 10.691', 'Aprovados: 10.428', 'Doc Aprovado: 4.294', 'Assinatura Contrato: 3.566'] },
    { id: '2', name: 'Treinamento Corporativo', creatorId: '1', description: 'Acompanhamento de horas de treinamento e eficácia dos programas.', images: [], metrics: ['Horas Totais: 5.200', 'Participantes: 1.340'] },
    { id: '3', name: 'Indicadores de Saúde', creatorId: '2', description: 'Relatório de medicina ocupacional com indicadores de saúde dos colaboradores.', images: [], metrics: ['Exames Realizados: 3.800', 'Atestados: 420'] },
    { id: '4', name: 'Headcount Corporativo', creatorId: '4', description: 'Análise de headcount e movimentações de pessoal.', images: [], metrics: ['Headcount: 8.500', 'Turnover: 2.3%'] },
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
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('admin_auth') === 'true');

  const [content, setContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('site_content_v2');
    return saved ? JSON.parse(saved) : DEFAULT_CONTENT;
  });

  const saveContent = useCallback((c: SiteContent) => {
    setContent(c);
    localStorage.setItem('site_content_v2', JSON.stringify(c));
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

  const updateContent = (partial: Partial<SiteContent>) => saveContent({ ...content, ...partial });

  const addAnalyst = (analyst: Analyst) => saveContent({ ...content, analysts: [...content.analysts, analyst] });
  const updateAnalyst = (id: string, data: Partial<Analyst>) =>
    saveContent({ ...content, analysts: content.analysts.map((a) => (a.id === id ? { ...a, ...data } : a)) });
  const removeAnalyst = (id: string) =>
    saveContent({ ...content, analysts: content.analysts.filter((a) => a.id !== id) });

  const addReport = (report: Report) => saveContent({ ...content, reports: [...content.reports, report] });
  const updateReport = (id: string, data: Partial<Report>) =>
    saveContent({ ...content, reports: content.reports.map((r) => (r.id === id ? { ...r, ...data } : r)) });
  const removeReport = (id: string) =>
    saveContent({ ...content, reports: content.reports.filter((r) => r.id !== id) });

  return (
    <AdminContext.Provider
      value={{ isAdmin, login, logout, content, updateContent, addAnalyst, updateAnalyst, removeAnalyst, addReport, updateReport, removeReport }}
    >
      {children}
    </AdminContext.Provider>
  );
};
