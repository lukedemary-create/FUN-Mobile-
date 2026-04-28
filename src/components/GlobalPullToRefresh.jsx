import React, { useState, useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function GlobalPullToRefresh({ children, onRefresh }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const touchStartRef = useRef(0);
  const isPullingRef = useRef(false);
  const queryClient = useQueryClient();

  const threshold = 80;
  const maxPull = 120;

  useEffect(() => {
    const handleTouchStart = (e) => {
      // Only allow pull-to-refresh when at top of page
      if (window.scrollY === 0) {
        touchStartRef.current = e.touches[0].clientY;
        setStartY(e.touches[0].clientY);
        isPullingRef.current = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isPullingRef.current || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartRef.current;

      // Only pull down
      if (diff > 0 && window.scrollY === 0) {
        e.preventDefault();
        const distance = Math.min(diff * 0.5, maxPull);
        setPullDistance(distance);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPullingRef.current) return;

      isPullingRef.current = false;

      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        
        try {
          // Use custom refresh handler if provided
          if (onRefresh) {
            await onRefresh();
          } else {
            // Default: invalidate all queries
            await queryClient.invalidateQueries();
            // Small delay for visual feedback
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (error) {
          console.error("Refresh failed:", error);
        }
        
        setIsRefreshing(false);
      }
      
      setPullDistance(0);
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pullDistance, isRefreshing, onRefresh, queryClient]);

  const rotation = isRefreshing ? "animate-spin" : `rotate-${Math.min(pullDistance * 3, 360)}`;
  const opacity = Math.min(pullDistance / threshold, 1);

  return (
    <div className="relative">
      {/* Pull indicator */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none transition-transform"
        style={{
          transform: `translateY(${Math.min(pullDistance, maxPull)}px)`,
          paddingTop: 'max(env(safe-area-inset-top), 1rem)',
        }}
      >
        <div
          className="bg-[#0a0e17] border border-[#1e293b] rounded-full p-3 shadow-lg"
          style={{ opacity }}
        >
          <RefreshCw
            className={`w-5 h-5 text-[#00d4aa] ${isRefreshing ? "animate-spin" : ""}`}
            style={{ 
              transform: isRefreshing ? "none" : `rotate(${Math.min(pullDistance * 3, 360)}deg)`,
              transition: isRefreshing ? "none" : "transform 0.1s ease-out"
            }}
          />
        </div>
      </div>

      {children}
    </div>
  );
}