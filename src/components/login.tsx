import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './auth-context';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ArrowRight, ArrowLeft, Rocket, KeyRound, Mail } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';

interface LoginProps {
  onSwitchToSignup: () => void;
  onBackToLanding: () => void;
}

export function Login({ onSwitchToSignup, onBackToLanding }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const { signIn } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setResetLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Password reset email sent! Check your inbox.');
      setForgotPasswordOpen(false);
      setResetEmail('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-fuchsia-950 to-cyan-950 p-4 overflow-hidden">
      {/* Vibrant Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Color-changing Gradient Orbs */}
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl"
          animate={{
            background: [
              'radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(168,85,247,0.2) 50%, transparent 100%)',
              'radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(219,39,119,0.2) 50%, transparent 100%)',
              'radial-gradient(circle, rgba(34,211,238,0.4) 0%, rgba(6,182,212,0.2) 50%, transparent 100%)',
              'radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(168,85,247,0.2) 50%, transparent 100%)',
            ],
            scale: [1, 1.2, 1.1, 1],
            rotate: [0, 90, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          animate={{
            background: [
              'radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(219,39,119,0.2) 50%, transparent 100%)',
              'radial-gradient(circle, rgba(34,211,238,0.4) 0%, rgba(6,182,212,0.2) 50%, transparent 100%)',
              'radial-gradient(circle, rgba(249,115,22,0.4) 0%, rgba(234,88,12,0.2) 50%, transparent 100%)',
              'radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(219,39,119,0.2) 50%, transparent 100%)',
            ],
            scale: [1, 1.3, 1.2, 1],
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl"
          animate={{
            background: [
              'radial-gradient(circle, rgba(34,211,238,0.4) 0%, rgba(6,182,212,0.2) 50%, transparent 100%)',
              'radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(168,85,247,0.2) 50%, transparent 100%)',
              'radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(219,39,119,0.2) 50%, transparent 100%)',
              'radial-gradient(circle, rgba(34,211,238,0.4) 0%, rgba(6,182,212,0.2) 50%, transparent 100%)',
            ],
            scale: [1.2, 1, 1.1, 1.2],
            rotate: [0, -90, -180, -360],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Back to Landing Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 z-20"
      >
        <Button
          onClick={onBackToLanding}
          variant="outline"
          className="gap-2 border-violet-400/50 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-violet-400/30">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/50"
          >
            <Rocket className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-2 text-3xl font-bold text-white"
          >
            Welcome to Momentum
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-violet-200 mb-8"
          >
            Track your expenses with style
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1.5 bg-white/10 border-violet-400/30 text-white placeholder:text-violet-300"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password" className="text-white">Password</Label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  Forgot?
                </motion.button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1.5 bg-white/10 border-violet-400/30 text-white placeholder:text-violet-300"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                type="submit"
                className="w-full group bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  'Signing in...'
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center"
          >
            <p className="text-violet-200">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-cyan-400 hover:text-cyan-300 hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-violet-50 to-fuchsia-50 border-violet-200">
          <DialogHeader>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30"
            >
              <KeyRound className="w-8 h-8 text-white" />
            </motion.div>
            <DialogTitle className="text-center text-2xl">Reset Password</DialogTitle>
            <DialogDescription className="text-center">
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleForgotPassword} className="space-y-4 mt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Label htmlFor="reset-email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1.5"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-3"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => setForgotPasswordOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={resetLoading}
                className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white"
              >
                {resetLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Mail className="w-4 h-4" />
                  </motion.div>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </motion.div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
