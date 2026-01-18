import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-fuchsia-950 to-cyan-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-500/30 via-purple-500/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/30 via-blue-500/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={onBack}
            variant="outline"
            className="gap-2 mb-8 border-violet-400/50 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-lg border border-violet-400/20 rounded-2xl p-8 lg:p-12"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/50">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </div>

          <div className="space-y-6 text-violet-100">
            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">📋 1. Information We Collect</h2>
              <p className="mb-4">
                Momentum collects information you provide directly to us when you create an account, use our services, or communicate with us. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account information (name, email address, password)</li>
                <li>Financial data (transactions, budgets, account balances)</li>
                <li>Usage information (how you interact with our service)</li>
                <li>Device information (browser type, operating system)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">🎯 2. How We Use Your Information</h2>
              <p className="mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and complete transactions</li>
                <li>Send you technical notices and support messages</li>
                <li>Provide AI-powered financial insights and recommendations</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">🔒 3. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your data. All data is encrypted in transit and at rest using bank-level encryption. We use Supabase, a secure PostgreSQL database with row-level security policies to ensure your data is protected.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">🤝 4. Data Sharing</h2>
              <p className="mb-4">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect the rights and safety of Momentum and our users</li>
                <li>With service providers who assist in operating our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">✅ 5. Your Rights</h2>
              <p className="mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Opt-out of certain data collection</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">🍪 6. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">👶 7. Children's Privacy</h2>
              <p>
                Momentum is not intended for users under the age of 18. We do not knowingly collect information from children under 18.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">📝 8. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">📧 9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a 
                  href="mailto:run40081@gmail.com" 
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  run40081@gmail.com
                </a>
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-violet-400/20">
              <p className="text-sm text-violet-300">
                Last Updated: October 28, 2025
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
