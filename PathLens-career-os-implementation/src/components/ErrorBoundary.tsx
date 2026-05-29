import { ReactNode, Component, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '40px auto',
            }}
          >
            <div
              style={{
                background: 'var(--color-danger-light)',
                border: '1px solid var(--color-danger)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px 20px',
              }}
            >
              <h2 style={{ color: 'var(--color-danger)', margin: '0 0 12px 0' }}>
                ⚠️ Something went wrong
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', margin: '0 0 16px 0' }}>
                We encountered an error. Please try refreshing the page.
              </p>
              <p
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  margin: '0',
                  wordBreak: 'break-word',
                  maxHeight: '100px',
                  overflow: 'auto',
                }}
              >
                {this.state.error?.message}
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  marginTop: '16px',
                  padding: '10px 24px',
                  background: 'var(--color-danger)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
