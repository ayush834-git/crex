import { cn } from "@/utils/cn";

interface FlipRevealProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}

export function FlipReveal({ front, back, className }: FlipRevealProps) {
  return (
    <div className={cn("group", className)}>
      <div className="hidden md:block md:[perspective:1200px]">
        <div className="grid h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          <div className="col-start-1 row-start-1 h-full [backface-visibility:hidden]">{front}</div>
          <div className="col-start-1 row-start-1 h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">{back}</div>
        </div>
      </div>
      <div className="space-y-3 md:hidden">
        {front}
        <div>{back}</div>
      </div>
    </div>
  );
}
