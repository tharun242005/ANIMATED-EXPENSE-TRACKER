import { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from './auth-context';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { ArrowRight, ArrowLeft, Rocket } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SignupProps {
  onSwitchToLogin: () => void;
  onBackToLanding: () => void;
}

export function Signup({ onSwitchToLogin, onBackToLanding }: SignupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await signUp(email, password, name);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
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
            Create Account
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-violet-200 mb-8"
          >
            Start your financial journey today
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="mt-1.5 bg-white/10 border-violet-400/30 text-white placeholder:text-violet-300"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
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
              transition={{ delay: 0.7 }}
            >
              <Label htmlFor="password" className="text-white">Password</Label>
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
              transition={{ delay: 0.8 }}
            >
              <Button
                type="submit"
                className="w-full group bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  'Creating account...'
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-center"
          >
            <p className="text-violet-200">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-cyan-400 hover:text-cyan-300 hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
