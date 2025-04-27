"use client";

import React from "react";
import { ChatInput } from "./ui/chat-input";
import { PrivateChatInput } from "./ui/private-chat-input";

export function ChatExamples() {
  const handleSend = (message: string) => {
    console.log("일반 메시지:", message);
    // 메시지 처리 로직
  };

  const handleExpandableSend = (message: string) => {
    console.log("확장형 메시지:", message);
    // 메시지 처리 로직
  };

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="space-y-2">
        <h2 className="typo-title-1-bold">기본 채팅 입력</h2>
        <div className="p-4 border rounded-lg">
          <ChatInput onSend={handleSend} />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="typo-title-1-bold">확장 가능한 채팅 입력</h2>
        <div className="p-4 border rounded-lg">
          <PrivateChatInput onSend={handleExpandableSend} />
        </div>
      </div>
    </div>
  );
}
