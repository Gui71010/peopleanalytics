
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Convenience function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- user_roles policies
CREATE POLICY "Anyone can read roles" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Only admins can modify roles" ON public.user_roles FOR ALL USING (public.is_admin());

-- Site settings table
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin modify settings" ON public.site_settings FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update settings" ON public.site_settings FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete settings" ON public.site_settings FOR DELETE USING (public.is_admin());

-- Analysts table
CREATE TABLE public.analysts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Analista de BI',
  area TEXT NOT NULL DEFAULT '',
  photo TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.analysts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read analysts" ON public.analysts FOR SELECT USING (true);
CREATE POLICY "Admin insert analysts" ON public.analysts FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update analysts" ON public.analysts FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete analysts" ON public.analysts FOR DELETE USING (public.is_admin());

-- Reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  creator_id UUID REFERENCES public.analysts(id) ON DELETE SET NULL,
  description TEXT NOT NULL DEFAULT '',
  images TEXT[] NOT NULL DEFAULT '{}',
  metrics TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read reports" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Admin insert reports" ON public.reports FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update reports" ON public.reports FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete reports" ON public.reports FOR DELETE USING (public.is_admin());

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_analysts_updated_at BEFORE UPDATE ON public.analysts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (key, value) VALUES
  ('areaDescription', 'Nossa área de Business Intelligence atua dentro da Diretoria de Pessoas, sendo responsável por transformar dados em insights estratégicos para a tomada de decisão. A equipe é composta por analistas especializados em diferentes squads, cada um focado em uma vertical do negócio.'),
  ('faqDescription', 'Bem-vindo ao FAQ dos Relatórios! Aqui você pode explorar as métricas de cada relatório criado pelo nosso time de dados. Selecione um analista para filtrar os relatórios por responsável e clique em qualquer relatório para ver seus detalhes e métricas.'),
  ('portfolioDescription', 'Conheça todos os relatórios produzidos pela nossa equipe de Business Intelligence. Selecione um analista para filtrar ou navegue por todo o portfólio.');

-- Insert default analysts
INSERT INTO public.analysts (name, role, area, bio, sort_order) VALUES
  ('Allyson Nunes', 'Analista de BI', 'Treinamento', 'Responsável pelos relatórios de treinamento e desenvolvimento de pessoas.', 1),
  ('Alessa Kettney', 'Analista de BI', 'Medicina e Business Partner', 'Responsável pelos relatórios de medicina ocupacional e atuação como Business Partner.', 2),
  ('Guilherme Santiago', 'Analista de BI', 'Recrutamento e Seleção', 'Responsável pelos relatórios de recrutamento, seleção e funil admissional.', 3),
  ('Matheus Wilson', 'Analista de BI', 'Corporativo', 'Responsável pelos relatórios corporativos e indicadores estratégicos.', 4);

-- Insert default reports (using subquery to get analyst ids)
INSERT INTO public.reports (name, creator_id, description, metrics, sort_order)
SELECT 'Gestão Candidato SOU', id, 'Funil admissional completo com métricas de inscritos, aprovados e contratados.',
  ARRAY['Inscritos Vaga: 10.691', 'Aprovados: 10.428', 'Doc Aprovado: 4.294', 'Assinatura Contrato: 3.566'], 1
FROM public.analysts WHERE name = 'Guilherme Santiago';

INSERT INTO public.reports (name, creator_id, description, metrics, sort_order)
SELECT 'Treinamento Corporativo', id, 'Acompanhamento de horas de treinamento e eficácia dos programas.',
  ARRAY['Horas Totais: 5.200', 'Participantes: 1.340'], 2
FROM public.analysts WHERE name = 'Allyson Nunes';

INSERT INTO public.reports (name, creator_id, description, metrics, sort_order)
SELECT 'Indicadores de Saúde', id, 'Relatório de medicina ocupacional com indicadores de saúde dos colaboradores.',
  ARRAY['Exames Realizados: 3.800', 'Atestados: 420'], 3
FROM public.analysts WHERE name = 'Alessa Kettney';

INSERT INTO public.reports (name, creator_id, description, metrics, sort_order)
SELECT 'Headcount Corporativo', id, 'Análise de headcount e movimentações de pessoal.',
  ARRAY['Headcount: 8.500', 'Turnover: 2.3%'], 4
FROM public.analysts WHERE name = 'Matheus Wilson';
