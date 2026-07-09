import Image from "next/image";
import promeraIcon from "@/icon/ic_promera.png";
import { cn } from "@/lib/utils";

type BrandLogoSize = "sm" | "md" | "lg";

const iconSizeClass: Record<BrandLogoSize, string> = {
  sm: "size-7 rounded-lg",
  md: "size-8 rounded-xl",
  lg: "size-10 rounded-2xl",
};

const textSizeClass: Record<BrandLogoSize, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
};

interface BrandLogoProps {
  size?: BrandLogoSize;
  showText?: boolean;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function BrandLogo({
  size = "md",
  showText = true,
  className,
  iconClassName,
  textClassName,
}: BrandLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-extrabold tracking-tight",
        className
      )}
    >
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center overflow-hidden",
          iconSizeClass[size],
          iconClassName
        )}
      >
        <Image
          src={promeraIcon}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-contain"
          sizes={size === "sm" ? "28px" : size === "md" ? "32px" : "40px"}
        />
      </span>
      {showText && (
        <span className={cn(textSizeClass[size], textClassName)}>PROMERA</span>
      )}
    </span>
  );
}
