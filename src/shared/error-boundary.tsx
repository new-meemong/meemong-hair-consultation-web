'use client';

import { addNextjsError } from '@datadog/browser-rum-nextjs';
import { Component, type ErrorInfo, type ReactNode, useEffect, useRef } from 'react';

import { useOverlayContext } from './context/overlay-context';
import { getErrorMessage } from './lib/error-handler';

const MAX_ERROR_RETRY_COUNT = 3;

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

function ErrorFallback({ error, onHandled }: { error: Error; onHandled?: () => void }) {
  const { showSnackBar } = useOverlayContext();
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (hasShownRef.current) return;
    hasShownRef.current = true;
    const errorMessage = getErrorMessage(error);
    showSnackBar({
      type: 'error',
      message: errorMessage,
    });
    onHandled?.();
  }, [error, onHandled, showSnackBar]);

  return null;
}

export class ErrorBoundary extends Component<Props, State> {
  private errorCount = 0;
  private lastErrorMessage: string | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by error boundary:', error);

    const currentErrorMessage = error.message;
    if (this.lastErrorMessage === currentErrorMessage) {
      this.errorCount++;
    } else {
      this.errorCount = 1;
      this.lastErrorMessage = currentErrorMessage;
      addNextjsError(error, errorInfo);
    }

    if (this.errorCount >= MAX_ERROR_RETRY_COUNT) {
      console.error('Too many repeated errors, stopping auto-recovery');
      return;
    }
  }

  componentDidUpdate(_prevProps: Props, prevState: State) {
    if (prevState.hasError && !this.state.hasError) {
      this.errorCount = 0;
      this.lastErrorMessage = null;
    }
  }

  render() {
    if (this.state.hasError && this.errorCount >= MAX_ERROR_RETRY_COUNT) {
      return (
        <ErrorFallback
          error={this.state.error || new Error('알 수 없는 오류가 발생했습니다.')}
          onHandled={() => {}}
        />
      );
    }

    return (
      <>
        {this.props.children}
        {this.state.hasError && (
          <ErrorFallback
            error={this.state.error || new Error('알 수 없는 오류가 발생했습니다.')}
            onHandled={() => {
              if (this.errorCount < MAX_ERROR_RETRY_COUNT) {
                this.setState({ hasError: false, error: undefined });
              }
            }}
          />
        )}
      </>
    );
  }
}
