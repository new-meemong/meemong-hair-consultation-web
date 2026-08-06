const CHAT_V2_USER_MESSAGE_TYPES = new Set(['text', 'image', 'file']);

export type ChatV2MessageStateTransition = {
  marksFirstReply: boolean;
  startsSenderAwaitingReply: boolean;
  clearsReceiverAwaitingReply: boolean;
};

type ResolveChatV2MessageStateTransitionParams = {
  messageType: string;
  senderId: string;
  channelOpenUserId: string;
  channelHasFirstReply: boolean;
  senderCanAwaitReplyRefund: boolean;
  senderIsRefunded: boolean;
  receiverAwaitingReply: boolean;
};

export function resolveChatV2MessageStateTransition({
  messageType,
  senderId,
  channelOpenUserId,
  channelHasFirstReply,
  senderCanAwaitReplyRefund,
  senderIsRefunded,
  receiverAwaitingReply,
}: ResolveChatV2MessageStateTransitionParams): ChatV2MessageStateTransition {
  const isUserMessage = CHAT_V2_USER_MESSAGE_TYPES.has(messageType);
  const marksFirstReply = isUserMessage && !channelHasFirstReply && senderId !== channelOpenUserId;

  return {
    marksFirstReply,
    startsSenderAwaitingReply: marksFirstReply && senderCanAwaitReplyRefund && !senderIsRefunded,
    clearsReceiverAwaitingReply: isUserMessage && receiverAwaitingReply,
  };
}
