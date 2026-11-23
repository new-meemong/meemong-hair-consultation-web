import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { HairConsultationChatMessageType } from '../type/hair-consultation-chat-message-type';
import {
  deleteOwnMessage,
  deletedMessageText,
} from '../store/hair-consultation-chat-message-store';

export function DeletedMessage() {
  return (
    <div
      style={{
        alignSelf: 'center',
        margin: '0 auto',
        width: 'fit-content',
        padding: '8px 12px',
        background: '#f4f4f4',
        borderRadius: 6,
        color: '#777',
        fontSize: 13,
        fontWeight: 500,
        lineHeight: '17px',
        letterSpacing: '-0.13px',
      }}
    >
      {deletedMessageText}
    </div>
  );
}

export function MessageActions({
  message,
  channelId,
  userId,
  children,
}: {
  message: HairConsultationChatMessageType;
  channelId: string;
  userId: string;
  children: ReactNode;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const origin = useRef({ x: 0, y: 0 });
  const suppressClick = useRef(false);
  const [menu, setMenu] = useState<{ left: number; top: number } | null>(null);
  const [toast, setToast] = useState('');
  const own = message.senderId === userId;
  const copy = message.messageType === 'text';
  function cancel() {
    clearTimeout(timer.current);
  }
  useEffect(() => cancel, []);
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(timeout);
  }, [toast]);
  useEffect(() => {
    if (!menu) return;
    const dismiss = () => setMenu(null);
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };
    window.addEventListener('scroll', dismiss, true);
    window.addEventListener('resize', dismiss);
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('scroll', dismiss, true);
      window.removeEventListener('resize', dismiss);
      window.removeEventListener('keydown', key);
    };
  }, [menu]);
  if (
    message.isSystemMessage ||
    message.analyticsKind === 'automatic' ||
    (!copy && !(own && message.messageType === 'image'))
  )
    return <>{children}</>;
  function open(box: DOMRect) {
    cancel();
    suppressClick.current = true;
    const height = own && copy ? 104 : 56;
    setMenu({
      left: Math.max(0, Math.min(innerWidth - 148, own ? box.right - 148 : box.left)),
      top: Math.max(
        0,
        box.bottom + 8 + height <= innerHeight ? box.bottom + 8 : box.top - height - 8,
      ),
    });
    const host = window as Window & { ChatMessageHaptic?: { postMessage(value: string): void } };
    if (host.ChatMessageHaptic) host.ChatMessageHaptic.postMessage('');
    else navigator.vibrate?.(15);
  }
  async function select(action: '복사' | '삭제') {
    setMenu(null);
    try {
      if (action === '복사') {
        await navigator.clipboard.writeText(message.message);
        setToast('메시지를 복사했어요');
      } else if (
        (message.createdAt &&
          'toMillis' in message.createdAt &&
          Date.now() - message.createdAt.toMillis() >= 360000) ||
        (await deleteOwnMessage(channelId, message.id, userId)) === 'expired'
      ) {
        setToast('보낸 지 6분이 지난 메시지는 삭제할 수 없어요');
      }
    } catch {
      setToast(action === '복사' ? '메시지 복사에 실패했습니다' : '메시지 삭제에 실패했습니다');
    }
  }
  return (
    <div
      style={{ userSelect: 'none', WebkitTouchCallout: 'none' }}
      onPointerDown={(e) => {
        cancel();
        suppressClick.current = false;
        origin.current = { x: e.clientX, y: e.clientY };
        const target = e.currentTarget;
        timer.current = setTimeout(() => open(target.getBoundingClientRect()), 500);
      }}
      onPointerMove={(e) => {
        if (Math.hypot(e.clientX - origin.current.x, e.clientY - origin.current.y) > 10) cancel();
      }}
      onPointerUp={cancel}
      onPointerCancel={cancel}
      onPointerLeave={cancel}
      onContextMenu={(e) => {
        e.preventDefault();
        if (!suppressClick.current) open(e.currentTarget.getBoundingClientRect());
      }}
      onClickCapture={(e) => {
        if (suppressClick.current && e.currentTarget.contains(e.target as Node)) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
    >
      {children}
      {menu &&
        createPortal(
          <div
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setMenu(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
          >
            <div
              role="menu"
              style={{
                position: 'absolute',
                ...menu,
                width: 148,
                padding: 4,
                boxSizing: 'border-box',
                borderRadius: 12,
                background: 'white',
                boxShadow: '0 0 28px #1d20241f',
              }}
            >
              {[...(copy ? ['복사' as const] : []), ...(own ? ['삭제' as const] : [])].map(
                (action) => (
                  <button
                    key={action}
                    role="menuitem"
                    type="button"
                    style={{
                      display: 'block',
                      border: 0,
                      background: 'transparent',
                      textAlign: 'left',
                      width: '100%',
                      padding: '12px 16px',
                      font: 'inherit',
                      fontSize: 16,
                      fontWeight: 500,
                      lineHeight: '24px',
                      color: '#2f343c',
                    }}
                    onClick={() => void select(action)}
                  >
                    {action}
                  </button>
                ),
              )}
            </div>
          </div>,
          document.body,
        )}
      {toast &&
        createPortal(
          <div
            role="status"
            style={{
              position: 'fixed',
              zIndex: 10000,
              bottom: 'calc(84px + env(safe-area-inset-bottom))',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(343px, calc(100% - 32px))',
              boxSizing: 'border-box',
              padding: '12px 16px',
              borderRadius: 10,
              background: 'rgba(29,32,36,.68)',
              backdropFilter: 'blur(25px)',
              color: 'white',
              fontSize: 14,
              lineHeight: '22px',
              fontWeight: 600,
            }}
          >
            {toast}
          </div>,
          document.body,
        )}
    </div>
  );
}
