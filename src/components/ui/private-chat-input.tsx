"use client";
import React, { useState } from "react";
import { Button } from "./button";
import { Textarea } from "./textarea";

interface PrivateChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const PrivateChatInput = React.forwardRef<
  HTMLDivElement,
  PrivateChatInputProps
>(
  (
    {
      onSend,
      placeholder = "댓글을 입력하세요",
      disabled = false,
      className = "",
    },
    ref,
  ) => {
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (message.trim()) {
        onSend(message);
        setMessage("");
      }
    };

    return (
      <div
        ref={ref}
        className={`flex w-full p-2.5 rounded-6 bg-alternative items-center gap-2 outline-none ${className}`}
      >
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Textarea
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder={placeholder}
            disabled={disabled}
            maxRows={3}
          />
          <Button
            type="submit"
            size="sm"
            variant="default"
            className="typo-body-2-medium rounded-4 self-end"
          >
            등록
          </Button>
        </form>
      </div>
    );
  },
);

PrivateChatInput.displayName = "PrivateChatInput";
