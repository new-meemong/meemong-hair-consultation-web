"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import EditIcon from "@/assets/icons/edit.svg";

interface WriteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}

export function WriteButton({
  className,
  children = "글쓰기",
  ...props
}: WriteButtonProps) {
  return (
    <button
      className={cn(
        "flex items-center justify-center gap-1 px-6 py-3 rounded-full bg-[#222222] text-white hover:bg-[#333333] shadow-heavy disabled:pointer-events-none w-fit h-11",
        "typo-body-1-regular",
        className,
      )}
      type="button"
      {...props}
    >
      <EditIcon className="size-5 fill-current" />
      {children}
    </button>
  );
}
