import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a recovery session
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setReady(true);
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (password !== confirm) {
      toast.error('As senhas não conferem');
      return;
    }
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error('Erro ao atualizar senha: ' + error.message);
    } else {
      toast.success('Senha atualizada com sucesso!');
      navigate('/');
    }
    setLoading(false);
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">Redefinir Senha</h1>
          <p className="text-muted-foreground">Link inválido ou expirado. Solicite um novo link de recuperação.</p>
          <Button onClick={() => navigate('/')} className="mt-4 gradient-accent text-primary-foreground border-0">
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-display font-bold text-foreground mb-6">Nova Senha</h1>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button onClick={handleSubmit} disabled={loading} className="w-full gradient-accent text-primary-foreground border-0">
            {loading ? 'Salvando...' : 'Salvar nova senha'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
