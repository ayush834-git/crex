import { cn } from "@/utils/cn";

interface FlipRevealProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}

export function FlipReveal({ front, back, className }: FlipRevealProps) {
  return (
    <div className={cn("group [perspective:1200px]", className)}>
      <div className="hidden h-full min-h-[360px] transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] md:block">
        <div className="absolute inset-0 [backface-visibility:hidden]">{front}</div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">{back}</div>
      </div>
      <div className="md:hidden">
        {front}
        <div className="mt-3">{back}</div>
      </div>
    </div>
  );
}
