import React, { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {(!isOnline || showReconnected) && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
          style={{
            paddingTop: 'env(safe-area-inset-top)',
          }}
        >
          <div 
            className={`mx-auto max-w-md mt-2 rounded-xl shadow-2xl border ${
              isOnline 
                ? "bg-[#00d4aa] border-[#00d4aa]/30 text-black" 
                : "bg-[#ef4444] border-[#ef4444]/30 text-white"
            }`}
            style={{
              marginLeft: 'max(env(safe-area-inset-left), 1rem)',
              marginRight: 'max(env(safe-area-inset-right), 1rem)',
            }}
          >
            <div className="px-4 py-3 flex items-center gap-3">
              {isOnline ? (
                <Wifi className="w-5 h-5 flex-shrink-0" />
              ) : (
                <WifiOff className="w-5 h-5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">
                  {isOnline ? "Back Online" : "No Internet Connection"}
                </p>
                <p className="text-xs opacity-90">
                  {isOnline 
                    ? "Your connection has been restored" 
                    : "Some features may be unavailable"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}