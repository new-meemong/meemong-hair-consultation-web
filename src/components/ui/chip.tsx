"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "selected";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Chip({
  className,
  variant = "default",
  icon,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      className={cn(
        "flex items-center justify-center gap-1 px-4 py-2 rounded-full transition-colors",
        "typo-body-1-medium",
        variant === "default"
          ? "bg-white text-label-normal border border-border"
          : "bg-label-normal text-white border-none",
        className,
      )}
      type="button"
      {...props}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  );
}

export function ChipGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>{children}</div>
  );
}
