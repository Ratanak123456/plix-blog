"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { useState } from "react";

type AuthModalProps = {
  open: boolean;
  mode: "login" | "register";
  onClose: () => void;
  onModeChange: (mode: "login" | "register") => void;
};

export function AuthModal({ open, mode, onClose, onModeChange }: AuthModalProps) {
  const [registrationFeedback, setRegistrationFeedback] = useState<string | null>(null);

  function handleClose() {
    setRegistrationFeedback(null);
    onClose();
  }

  function handleModeChange(nextMode: "login" | "register") {
    setRegistrationFeedback(null);
    onModeChange(nextMode);
  }

  function handleRegisterSuccess(_email: string) {
    setRegistrationFeedback("Registration completed. Sign in with your new account.");
    onModeChange("login");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="relative z-10 w-full max-w-md bg-card p-8 shadow-2xl comic-border"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground transition-colors hover:text-accent"
              aria-label="Close authentication modal"
            >
              <X size={24} />
            </button>
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

            {mode === "login" ? (
              <LoginForm onSuccess={handleClose} onModeChange={handleModeChange} />
            ) : (
              <RegisterForm onSuccess={handleRegisterSuccess} onModeChange={handleModeChange} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
