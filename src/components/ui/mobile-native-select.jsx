import React, { useState, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";

export function MobileNativeSelect({ value, onChange, options, placeholder = "Select...", className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`w-full h-11 px-3 py-2 bg-[#0a0e17] border border-[#1e293b] rounded-md text-left text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring flex items-center justify-between ${className}`}
      >
        <span className={value ? "text-white" : "text-[#64748b]"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-[#64748b] flex-shrink-0" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#111827] rounded-t-2xl border-t border-[#1e293b] animate-slide-up"
            style={{
              maxHeight: '70vh',
              paddingBottom: 'env(safe-area-inset-bottom)'
            }}
          >
            <div className="p-4 border-b border-[#1e293b] bg-[#111827] sticky top-0 z-10">
              <div className="w-12 h-1 bg-[#334155] rounded-full mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">{placeholder}</h3>
            </div>
            <div 
              className="overflow-auto"
              style={{
                maxHeight: 'calc(70vh - 80px)',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain'
              }}
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-[#1e293b] transition-colors border-b border-[#1e293b]/50 last:border-b-0 min-h-[60px] touch-manipulation active:bg-[#334155]"
                >
                  <span className={`text-base ${value === option.value ? "text-[#00d4aa] font-medium" : "text-white"}`}>
                    {option.label}
                  </span>
                  {value === option.value && (
                    <Check className="w-5 h-5 text-[#00d4aa]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}