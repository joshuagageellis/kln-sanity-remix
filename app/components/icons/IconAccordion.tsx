export const AccordionIcon = () => (
  <svg
    className="h-full w-full transition-all duration-200 group-data-[state=open]:rotate-90"
    fill="none"
    viewBox="0 0 50 50"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      className="group-data-[state=open]:opacity-1 transition-all duration-200 group-data-[state=closed]:opacity-0"
      stroke="currentColor"
      x1="7.70707"
      x2="43.0624"
      y1="7.00131"
      y2="42.3566"
    />
    <line
      className="opacity-1 transition-all duration-200 group-data-[state=open]:opacity-0"
      stroke="currentColor"
      x1="25.5"
      x2="25.5"
      y1="15"
      y2="36"
    />
    <line
      className="opacity-1 transition-all duration-200 group-data-[state=open]:opacity-0"
      stroke="currentColor"
      x1="36"
      x2="15"
      y1="25.5"
      y2="25.5"
    />
    <circle cx="25" cy="25" r="24.5" stroke="currentColor" />
  </svg>
);
