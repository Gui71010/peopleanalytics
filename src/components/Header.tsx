import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, LogOut, KeyRound } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'area', label: 'Nossa Área' },
  { id: 'portfolio', label: 'Relatórios Criados' },
  { id: 'faq', label: 'FAQ dos Relatórios' },
];

const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  const { isAdmin, login, logout, resetPassword } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const success = await login(email, password);
    if (success) {
      setOpen(false);
      setEmail('');
      setPassword('');
    } else {
      setError('Email ou senha incorretos');
    }
    setLoading(false);
  };

  const handleReset = async () => {
    setLoading(true);
    await resetPassword(resetEmail);
    setLoading(false);
    setResetOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 gradient-navy border-b border-border/20">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-lg">BI</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-primary-foreground text-lg leading-tight">
                Diretoria de Pessoas
              </h1>
              <p className="text-primary-foreground/60 text-xs">Business Intelligence</p>
            </div>
          </motion.div>

          <nav className="flex items-center gap-1 bg-secondary/50 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-primary-foreground'
                    : 'text-primary-foreground/50 hover:text-primary-foreground/80'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 gradient-accent rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-accent font-medium">Admin</span>
                <Dialog open={resetOpen} onOpenChange={setResetOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-primary-foreground/60 hover:text-primary-foreground hover:bg-secondary" title="Alterar senha">
                      <KeyRound className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card">
                    <DialogHeader>
                      <DialogTitle className="font-display">Alterar Senha</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <p className="text-sm text-muted-foreground">
                        Um email será enviado para você redefinir sua senha.
                      </p>
                      <Input
                        type="email"
                        placeholder="Seu email de admin"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                      />
                      <Button onClick={handleReset} disabled={loading} className="w-full gradient-accent text-primary-foreground border-0">
                        {loading ? 'Enviando...' : 'Enviar email de recuperação'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="icon" onClick={logout} className="text-primary-foreground/60 hover:text-primary-foreground hover:bg-secondary">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-primary-foreground/40 hover:text-primary-foreground hover:bg-secondary">
                    <Shield className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card">
                  <DialogHeader>
                    <DialogTitle className="font-display">Acesso Administrativo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    />
                    <Input
                      type="password"
                      placeholder="Senha"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    {error && <p className="text-destructive text-sm">{error}</p>}
                    <Button onClick={handleLogin} disabled={loading} className="w-full gradient-accent text-primary-foreground border-0">
                      {loading ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
