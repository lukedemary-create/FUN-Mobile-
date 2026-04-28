import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, TrendingUp, Users, GraduationCap, CheckCircle2 } from "lucide-react";

export default function WelcomeModal({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0e17] border-[#1e293b] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d4aa] to-[#3b82f6] mb-2">
            Welcome to Planora™
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Message */}
          <div className="bg-gradient-to-br from-[#00d4aa]/10 to-[#3b82f6]/10 rounded-xl p-6 border border-[#00d4aa]/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#00d4aa]/20 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-[#00d4aa]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Your Financial Education Platform</h3>
                <p className="text-[#e2e8f0] text-sm leading-relaxed">
                  Planora empowers you to step into the shoes of a financial advisor <strong>before</strong> you meet with one. 
                  We help you understand the Six Pillars of Financial Planning, analyze your budget, explore market history, 
                  and run professional-grade simulations — all so you can arrive at your advisor meeting prepared, 
                  informed, and ready to make confident decisions.
                </p>
              </div>
            </div>
          </div>

          {/* What You'll Learn */}
          <div>
            <h4 className="text-sm font-semibold text-[#00d4aa] mb-3">What You'll Learn & Do:</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#00d4aa] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">Master the Six Pillars of Planning</p>
                  <p className="text-xs text-[#94a3b8]">Estate, Taxes, Trust, Financial, Retirement & Insurance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#3b82f6] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">Build & Analyze Your Budget</p>
                  <p className="text-xs text-[#94a3b8]">Income, expenses, goals, debt payoff & emergency funds</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">Explore 150+ Years of Market History</p>
                  <p className="text-xs text-[#94a3b8]">Crashes, recoveries, Fed policy & economic cycles</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#ec4899] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">Run Monte Carlo Simulations</p>
                  <p className="text-xs text-[#94a3b8]">Stress-test portfolios and understand risk vs. reward</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#8b5cf6] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">Access 12 Breakdown Reports</p>
                  <p className="text-xs text-[#94a3b8]">Get specialized scenario PDF reports tailored to you</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#00d4aa] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">Find Vetted Financial Advisors</p>
                  <p className="text-xs text-[#94a3b8]">Connect with CFPs, CPAs & fiduciaries when you're ready</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why This Matters */}
          <div className="bg-[#1e293b]/30 rounded-xl p-5 border border-[#1e293b]">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Why This Matters</h4>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Walking into a financial advisor meeting unprepared can feel overwhelming. Planora gives you the 
                  knowledge and confidence to ask the right questions, understand recommendations, and actively 
                  participate in your financial planning. You're not replacing your advisor — you're becoming a better, 
                  more informed client.
                </p>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="bg-[#ef4444]/5 rounded-xl p-5 border border-[#ef4444]/20">
            <p className="text-xs text-[#e2e8f0] leading-relaxed text-center">
              <strong className="text-[#ef4444]">Educational purposes only. Not financial advice.</strong>
              <br />
              Consult a certified financial professional (CFP, CPA, attorney) for personal decisions.
            </p>
          </div>

          {/* CTA */}
          <Button 
            onClick={onClose} 
            className="w-full bg-gradient-to-r from-[#00d4aa] to-[#3b82f6] hover:opacity-90 text-black font-semibold touch-manipulation active:scale-95"
            aria-label="Close welcome modal and get started"
          >
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}