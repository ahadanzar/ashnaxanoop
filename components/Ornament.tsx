export default function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`ornament ${className}`}
      viewBox="0 0 240 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 12h86" opacity=".7" />
      <path d="M150 12h86" opacity=".7" />
      <path d="M120 3c4 4 4 14 0 18-4-4-4-14 0-18Z" />
      <path d="M108 12c4-4 10-4 12 0-2 4-8 4-12 0Z" />
      <path d="M132 12c-4-4-10-4-12 0 2 4 8 4 12 0Z" />
      <circle cx="96" cy="12" r="1.6" fill="currentColor" />
      <circle cx="144" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}
