import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Analyst {
  id: string;
  name: string;
  role: string;
  area: string;
  photo: string;
  bio: string;
  sort_order: number;
}

export interface Report {
  id: string;
  name: string;
  creator_id: string | null;
  description: string;
  images: string[];
  metrics: string[];
  sort_order: number;
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
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  content: SiteContent;
  updateSetting: (key: string, value: string) => Promise<void>;
  addAnalyst: (analyst: Omit<Analyst, 'id'>) => Promise<void>;
  updateAnalyst: (id: string, data: Partial<Analyst>) => Promise<void>;
  removeAnalyst: (id: string) => Promise<void>;
  addReport: (report: Omit<Report, 'id'>) => Promise<void>;
  updateReport: (id: string, data: Partial<Report>) => Promise<void>;
  removeReport: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DEFAULT_CONTENT: SiteContent = {
  areaDescription: '',
  faqDescription: '',
  portfolioDescription: '',
  analysts: [],
  reports: [],
};

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);

  const fetchData = useCallback(async () => {
    try {
      const [settingsRes, analystsRes, reportsRes] = await Promise.all([
        supabase.from('site_settings').select('*'),
        supabase.from('analysts').select('*').order('sort_order'),
        supabase.from('reports').select('*').order('sort_order'),
      ]);

      const settings: Record<string, string> = {};
      (settingsRes.data || []).forEach((s: any) => { settings[s.key] = s.value; });

      setContent({
        areaDescription: settings.areaDescription || '',
        faqDescription: settings.faqDescription || '',
        portfolioDescription: settings.portfolioDescription || '',
        analysts: (analystsRes.data || []).map((a: any) => ({
          id: a.id,
          name: a.name,
          role: a.role,
          area: a.area,
          photo: a.photo || '',
          bio: a.bio || '',
          sort_order: a.sort_order || 0,
        })),
        reports: (reportsRes.data || []).map((r: any) => ({
          id: r.id,
          name: r.name,
          creator_id: r.creator_id,
          description: r.description || '',
          images: r.images || [],
          metrics: r.metrics || [],
          sort_order: r.sort_order || 0,
        })),
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }, []);

  // Check auth state
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin');
        setIsAdmin(!!(roles && roles.length > 0));
      }
      setIsLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin');
        setIsAdmin(!!(roles && roles.length > 0));
      } else {
        setIsAdmin(false);
      }
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, []);

  // Fetch data on mount
  useEffect(() => { fetchData(); }, [fetchData]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Login error:', error.message);
      return false;
    }
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error('Erro ao enviar email de recuperação');
      return false;
    }
    toast.success('Email de recuperação enviado!');
    return true;
  };

  const updateSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from('site_settings')
      .update({ value })
      .eq('key', key);
    if (error) { toast.error('Erro ao salvar'); return; }
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const addAnalyst = async (analyst: Omit<Analyst, 'id'>) => {
    const { data, error } = await supabase.from('analysts').insert(analyst).select().single();
    if (error) { toast.error('Erro ao adicionar'); return; }
    setContent(prev => ({ ...prev, analysts: [...prev.analysts, data as any] }));
  };

  const updateAnalyst = async (id: string, data: Partial<Analyst>) => {
    const { error } = await supabase.from('analysts').update(data).eq('id', id);
    if (error) { toast.error('Erro ao salvar'); return; }
    setContent(prev => ({
      ...prev,
      analysts: prev.analysts.map(a => a.id === id ? { ...a, ...data } : a),
    }));
  };

  const removeAnalyst = async (id: string) => {
    const { error } = await supabase.from('analysts').delete().eq('id', id);
    if (error) { toast.error('Erro ao remover'); return; }
    setContent(prev => ({ ...prev, analysts: prev.analysts.filter(a => a.id !== id) }));
  };

  const addReport = async (report: Omit<Report, 'id'>) => {
    const { data, error } = await supabase.from('reports').insert(report).select().single();
    if (error) { toast.error('Erro ao adicionar'); return; }
    setContent(prev => ({ ...prev, reports: [...prev.reports, data as any] }));
  };

  const updateReport = async (id: string, data: Partial<Report>) => {
    const { error } = await supabase.from('reports').update(data).eq('id', id);
    if (error) { toast.error('Erro ao salvar'); return; }
    setContent(prev => ({
      ...prev,
      reports: prev.reports.map(r => r.id === id ? { ...r, ...data } : r),
    }));
  };

  const removeReport = async (id: string) => {
    const { error } = await supabase.from('reports').delete().eq('id', id);
    if (error) { toast.error('Erro ao remover'); return; }
    setContent(prev => ({ ...prev, reports: prev.reports.filter(r => r.id !== id) }));
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin, isLoading, login, logout, resetPassword, content,
        updateSetting, addAnalyst, updateAnalyst, removeAnalyst,
        addReport, updateReport, removeReport, refreshData: fetchData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
