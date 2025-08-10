'use client';

import { Component, type ReactNode, useEffect, useRef } from 'react';

import { useOverlayContext } from './context/overlay-context';
import { getErrorMessage } from './lib/error-handler';

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
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Error caught by error boundary:', error);
  }

  render() {
    return (
      <>
        {this.props.children}
        {this.state.hasError && (
          <ErrorFallback
            error={this.state.error || new Error('알 수 없는 오류가 발생했습니다.')}
            onHandled={() => this.setState({ hasError: false, error: undefined })}
          />
        )}
      </>
    );
  }
}
