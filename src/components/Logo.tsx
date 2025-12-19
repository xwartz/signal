import { cn } from "../lib/utils";

const LogoIcon = () => (
    <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path d="M12 2l4 4-4 4-4 4-4-4 4-4zM2 12l4 4-4 4-4-4 4-4zM12 12l4 4-4 4-4-4 4-4zM16 6l-4 4-4-4" />
        </svg>
    </div>
);


export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
        <LogoIcon />
      <h2 className="text-lg font-semibold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
        布噜 AI
      </h2>
    </div>
  );
}
