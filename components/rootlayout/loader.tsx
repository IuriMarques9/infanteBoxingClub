import { BoxingGloveIcon } from "@radix-ui/react-icons";
import { cn } from "../../lib/utils";

const Loader = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <BoxingGloveIcon className="h-24 w-24 animate-pulse text-primary" />
      </div>
    </div>
  );
};

export default Loader;
