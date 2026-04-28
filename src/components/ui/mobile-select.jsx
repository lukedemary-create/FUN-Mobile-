import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mobile-friendly bottom sheet select component
 * Falls back to standard Select on desktop
 */
export function MobileSelect({ 
  value, 
  onValueChange, 
  children, 
  placeholder = "Select an option",
  className,
  disabled = false 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Extract options from children - handle both direct children and nested in Content
  const extractOptions = (childrenArray) => {
    const options = [];
    React.Children.forEach(childrenArray, (child) => {
      if (child?.type === MobileSelectItem) {
        options.push({
          value: child.props.value,
          label: child.props.children
        });
      } else if (child?.type === MobileSelectContent) {
        React.Children.forEach(child.props.children, (nestedChild) => {
          if (nestedChild?.type === MobileSelectItem) {
            options.push({
              value: nestedChild.props.value,
              label: nestedChild.props.children
            });
          }
        });
      }
    });
    return options;
  };

  const options = extractOptions(React.Children.toArray(children));
  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  // If not mobile, render standard select
  if (!isMobile) {
    return (
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        {!value && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  // Mobile bottom sheet
  return (
    <>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] touch-manipulation text-left",
          className
        )}
      >
        <span className={selectedOption ? "text-white" : "text-muted-foreground"}>
          {selectedOption?.label || placeholder}
        </span>
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 opacity-50"
        >
          <path
            d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50"
              style={{
                maxHeight: '70vh'
              }}
            >
              <div className="bg-[#111827] rounded-t-3xl border-t border-[#1e293b] h-full flex flex-col">
                <div className="flex-shrink-0 px-6 py-4 border-b border-[#1e293b]">
                  <h3 className="text-lg font-semibold text-white">{placeholder}</h3>
                </div>
                <div 
                  className="overflow-y-scroll flex-1 p-4"
                  style={{ 
                    WebkitOverflowScrolling: 'touch',
                    overscrollBehavior: 'contain',
                    paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)'
                  }}
                >
                  <div className="space-y-2">
                    {options.map((option) => {
                      const isSelected = option.value === value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleSelect(option.value)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all min-h-[44px] touch-manipulation active:scale-95",
                            isSelected
                              ? "bg-[#00d4aa]/10 border border-[#00d4aa]/30 text-[#00d4aa]"
                              : "bg-[#0a0e17] border border-[#1e293b] text-white hover:border-[#00d4aa]/20"
                          )}
                        >
                          <span className="font-medium">{option.label}</span>
                          {isSelected && <Check className="w-5 h-5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function MobileSelectItem({ value, children }) {
  // This component is used for extracting options in MobileSelect
  // It doesn't render anything itself
  return null;
}

export function MobileSelectTrigger({ children, className }) {
  // Wrapper for compatibility - not used in mobile mode
  return null;
}

export function MobileSelectValue({ placeholder }) {
  // Wrapper for compatibility - not used in mobile mode
  return null;
}

export function MobileSelectContent({ children }) {
  // Wrapper for compatibility - not used in mobile mode
  return children;
}