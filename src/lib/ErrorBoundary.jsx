import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production, errors are silent. In dev they show in console.
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        padding: 24,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{
            width: 56, height: 56, background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.3)', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: 24,
          }}>⚠</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: '0 0 12px' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 28px' }}>
            An unexpected error occurred. Please refresh the page. If the problem persists, try clearing your browser cache.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#F5A623', color: '#0a0a0f', border: 'none',
              borderRadius: 8, padding: '10px 24px', fontSize: 14,
              fontWeight: 700, cursor: 'pointer',
            }}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}
