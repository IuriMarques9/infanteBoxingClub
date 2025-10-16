import { cn } from "../../lib/utils";
import Image from "next/image";

const Loader = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <Image src={"/infanteLogo.png"} alt="Infante Logo" fill className="object-cover" priority/>
      </div>
    </div>
  );
};

export default Loader;
