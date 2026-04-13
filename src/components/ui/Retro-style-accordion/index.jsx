/* eslint-disable react/prop-types */
import React, {
  useState,
  useContext,
  createContext,
  forwardRef,
  useId,
} from "react";
const cn = (...args) =>
  args
    .flatMap((arg) => {
      if (!arg) return [];
      if (typeof arg === "string") return [arg];
      if (typeof arg === "number") return [String(arg)];
      if (Array.isArray(arg)) return arg.filter(Boolean);
      if (typeof arg === "object")
        return Object.entries(arg)
          .filter(([, v]) => Boolean(v))
          .map(([k]) => k);
      return [];
    })
    .join(" ");
const AccordionContext = createContext(null);
const useAccordion = () => {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("useAccordion must be used within <Accordion>");
  return ctx;
};
const ItemContext = createContext(null);
const useItem = () => {
  const ctx = useContext(ItemContext);
  if (!ctx) throw new Error("useItem must be used within <AccordionItem>");
  return ctx;
};
const Accordion = forwardRef(
  ({ className, children, defaultValue = null, ...props }, ref) => {
    const [openValue, setOpen] = useState(defaultValue);
    const setOpenValue = (value) => {
      setOpen((prev) => (prev === value ? null : value));
    };
    return (
      <AccordionContext.Provider
        value={{
          openValue,
          setOpenValue,
        }}
      >
        <div
          ref={ref}
          className={cn("w-full max-w-lg mx-auto space-y-4", className)}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";
const AccordionItem = forwardRef(
  ({ className, value, children, ...props }, ref) => {
    const uid = useId();
    const triggerId = `${uid}-trigger`;
    const contentId = `${uid}-content`;
    return (
      <ItemContext.Provider
        value={{
          value,
          triggerId,
          contentId,
        }}
      >
        <div
          ref={ref}
          className={cn(
            "border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000000] transition-all duration-200 dark:bg-black dark:border-white dark:shadow-[4px_4px_0px_0px_#FFFFFF]",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = forwardRef(
  ({ className, children, ...props }, ref) => {
    const { openValue, setOpenValue } = useAccordion();
    const { value, triggerId, contentId } = useItem();
    const isOpen = openValue === value;
    return (
      <button
        ref={ref}
        id={triggerId}
        aria-controls={contentId}
        aria-expanded={isOpen}
        type="button"
        onClick={() => setOpenValue(value)}
        className={cn(
          "flex w-full items-center justify-between p-4 font-bold text-lg bg-[#4A6DA7] text-white cursor-pointer hover:opacity-50 transition-colors",
          className
        )}
        {...props}
      >
        {children}
        <ChevronIcon isOpen={isOpen} />
      </button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";
const AccordionContent = forwardRef(
  ({ className, children, ...props }, ref) => {
    const { openValue } = useAccordion();
    const { value, triggerId, contentId } = useItem();
    const isOpen = openValue === value;
    return (
      <div
        ref={ref}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-200 ease-in-out motion-reduce:transition-none",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          className
        )}
        {...props}
      >
        <div className="overflow-hidden">
          <div className="p-4 border-t-2 border-black text-gray-700 dark:border-white dark:text-gray-300">
            {children}
          </div>
        </div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";
const ChevronIcon = ({ isOpen }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("transform transition-transform duration-200 ease-in-out", {
      "rotate-180": isOpen,
    })}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
