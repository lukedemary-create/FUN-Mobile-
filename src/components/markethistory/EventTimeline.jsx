import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function EventTimeline({ specificEvents }) {
  if (!specificEvents || specificEvents.length === 0) return null;

  return (
    <div className="mt-6 pt-4 border-t border-[#1e293b]">
      <h4 className="text-xs font-semibold text-[#94a3b8] mb-4 uppercase tracking-wider">Key Events Timeline</h4>
      <div className="relative pb-8">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#1e293b]" />
        <TooltipProvider delayDuration={0}>
          <div className="relative">
            {specificEvents.map((event, idx) => {
              const position = (idx / Math.max(specificEvents.length - 1, 1)) * 100;
              return (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <button
                      className="absolute top-0 -translate-x-1/2 group"
                      style={{ left: `${position}%` }}
                    >
                      <div className="w-4 h-4 rounded-full bg-[#f59e0b] border-2 border-[#0a0e17] group-hover:scale-125 transition-transform shadow-lg shadow-[#f59e0b]/30" />
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-px h-2 bg-[#1e293b]" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="bottom" 
                    className="bg-[#111827] border-[#1e293b] text-white max-w-xs"
                  >
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-[#f59e0b]">{event.date}</p>
                      <p className="text-[#e2e8f0] leading-relaxed">{event.description}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}