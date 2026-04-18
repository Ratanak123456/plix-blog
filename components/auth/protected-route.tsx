"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/store";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { motion, AnimatePresence } from "framer-motion";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [registrationFeedback, setRegistrationFeedback] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  function handleRegisterSuccess() {
    setRegistrationFeedback("Registration completed. Sign in with your new account.");
    setMode("login");
  }

  function handleModeChange(nextMode: "login" | "register") {
    setRegistrationFeedback(null);
    setMode(nextMode);
  }

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.3 }}
        className="w-full max-w-md bg-card p-8 shadow-2xl comic-border"
      >
        <span className="font-bangers text-3xl logo-gradient">PLIXBLOG</span>
        <h2 className="mt-1 mb-1 font-bangers text-4xl">
          {mode === "login" ? "ENTER THE UNIVERSE" : "JOIN THE HEROES"}
        </h2>
        <p className="mb-6 font-oswald text-sm uppercase tracking-wide text-muted-foreground">
          {mode === "login" ? "Sign in to your account" : "Create your secret identity"}
        </p>

        {registrationFeedback && mode === "login" && (
          <p className="mb-4 font-oswald text-sm text-emerald-500">{registrationFeedback}</p>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {mode === "login" ? (
              <LoginForm 
                onSuccess={() => {}} 
                onModeChange={handleModeChange} 
              />
            ) : (
              <RegisterForm 
                onSuccess={handleRegisterSuccess} 
                onModeChange={handleModeChange} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
