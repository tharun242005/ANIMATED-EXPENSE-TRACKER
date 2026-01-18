import { useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface TermsOfServiceProps {
  onBack: () => void;
}

export function TermsOfService({ onBack }: TermsOfServiceProps) {
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
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              Terms of Service
            </h1>
          </div>

          <div className="space-y-6 text-violet-100">
            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">✍️ 1. Acceptance of Terms</h2>
              <p>
                By accessing and using Momentum, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">💼 2. Description of Service</h2>
              <p className="mb-4">
                Momentum is a financial management and expense tracking application that provides:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Expense and income tracking</li>
                <li>Budget management tools</li>
                <li>Financial analytics and reporting</li>
                <li>AI-powered financial insights</li>
                <li>Multi-account management</li>
                <li>Receipt scanning and management</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">👤 3. User Responsibilities</h2>
              <p className="mb-4">
                You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Use the service in compliance with all applicable laws</li>
                <li>Not use the service for any illegal or unauthorized purpose</li>
                <li>Not attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">📝 4. Account Registration</h2>
              <p>
                To use Momentum, you must create an account. You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">📊 5. Data Accuracy</h2>
              <p>
                While we strive to provide accurate financial insights and calculations, Momentum is a tool to assist with personal finance management. You are responsible for verifying the accuracy of all financial data and decisions made based on information provided by the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">©️ 6. Intellectual Property</h2>
              <p>
                The service and its original content, features, and functionality are owned by Momentum and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">⚖️ 7. Limitation of Liability</h2>
              <p>
                Momentum shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service. We do not guarantee that the service will be uninterrupted, timely, secure, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">🚫 8. Termination</h2>
              <p>
                We reserve the right to terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including breach of these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">🔧 9. Service Modifications</h2>
              <p>
                We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">🔗 10. Third-Party Services</h2>
              <p>
                Our service may contain links to third-party websites or services that are not owned or controlled by Momentum. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">⚖️ 11. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">📝 12. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-white">📧 13. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at{' '}
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
