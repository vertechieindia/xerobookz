import React from "react";
import { cn } from "../utils/cn";

export interface XeroBookzLogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  href?: string;
  onClick?: () => void;
  clickable?: boolean;
}

export const XeroBookzLogo: React.FC<XeroBookzLogoProps> = ({
  variant = "dark",
  size = "md",
  className,
  href,
  onClick,
  clickable = true,
}) => {
  const sizeClasses = {
    sm: "h-10",    // 40px - increased from 32px
    md: "h-16",    // 64px - increased from 48px
    lg: "h-24",    // 96px - increased from 64px
    xl: "h-32",    // 128px - new
    "2xl": "h-40", // 160px - new
  };

  // Logo path - should be in each app's public folder
  const logoSrc = "/logo_bg.png";

  const isClickable = clickable && (href || onClick);

  const logoContent = (
    <img
      src={logoSrc}
      alt="XeroBookz Logo"
      className={cn(
        sizeClasses[size],
        "w-auto object-contain",
        isClickable && "cursor-pointer transition-opacity hover:opacity-80"
      )}
    />
  );

  const containerClasses = cn("flex items-center justify-center w-full", className);

  if (href && !onClick) {
    return (
      <a href={href} className={containerClasses}>
        {logoContent}
      </a>
    );
  }

  if (onClick) {
    return (
      <button 
        onClick={onClick} 
        className={cn(containerClasses, "bg-transparent border-none p-0 cursor-pointer")}
        type="button"
      >
        {logoContent}
      </button>
    );
  }

  return (
    <div className={containerClasses}>
      {logoContent}
    </div>
  );
};
