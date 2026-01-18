import { useState, useEffect } from "react";
import {
  AuthProvider,
  useAuth,
} from "./components/auth-context";
import { Login } from "./components/login";
import { Signup } from "./components/signup";
import { LandingPage } from "./components/landing-page";
import { Layout } from "./components/layout";
import { Dashboard } from "./components/dashboard";
import { TransactionsPage } from "./components/transactions-page";
import { BudgetsPage } from "./components/budgets-page";
import { AccountsPage } from "./components/accounts-page";
import { CategoriesPage } from "./components/categories-page";
import { ReportsPage } from "./components/reports-page";
import { ProfilePage } from "./components/profile-page";
import { AnimatedLoader } from "./components/animated-loader";
import { Toaster } from "./components/ui/sonner";
import { PrivacyPolicy } from "./components/privacy-policy";
import { TermsOfService } from "./components/terms-of-service";
import { DemoPage } from "./components/demo-page";

function AppContent() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState<"landing" | "login" | "signup" | "demo" | "privacy" | "terms">(
    "landing",
  );
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    const handleOpenDemo = () => setAuthView("demo");
    const handleOpenPrivacy = () => setAuthView("privacy");
    const handleOpenTerms = () => setAuthView("terms");

    window.addEventListener('openDemo', handleOpenDemo);
    window.addEventListener('openPrivacyPolicy', handleOpenPrivacy);
    window.addEventListener('openTermsOfService', handleOpenTerms);

    return () => {
      window.removeEventListener('openDemo', handleOpenDemo);
      window.removeEventListener('openPrivacyPolicy', handleOpenPrivacy);
      window.removeEventListener('openTermsOfService', handleOpenTerms);
    };
  }, []);

  if (loading) {
    return <AnimatedLoader />;
  }

  if (!user) {
    if (authView === "landing") {
      return (
        <LandingPage onGetStarted={() => setAuthView("login")} />
      );
    }
    if (authView === "login") {
      return (
        <Login 
          onSwitchToSignup={() => setAuthView("signup")} 
          onBackToLanding={() => setAuthView("landing")}
        />
      );
    }
    if (authView === "signup") {
      return (
        <Signup 
          onSwitchToLogin={() => setAuthView("login")} 
          onBackToLanding={() => setAuthView("landing")}
        />
      );
    }
    if (authView === "demo") {
      return (
        <DemoPage 
          onBack={() => setAuthView("landing")} 
          onGetStarted={() => setAuthView("login")}
        />
      );
    }
    if (authView === "privacy") {
      return (
        <PrivacyPolicy onBack={() => setAuthView("landing")} />
      );
    }
    if (authView === "terms") {
      return (
        <TermsOfService onBack={() => setAuthView("landing")} />
      );
    }
    return (
      <LandingPage onGetStarted={() => setAuthView("login")} />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "transactions":
        return <TransactionsPage />;
      case "budgets":
        return <BudgetsPage />;
      case "accounts":
        return <AccountsPage />;
      case "categories":
        return <CategoriesPage />;
      case "reports":
        return <ReportsPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
    >
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}