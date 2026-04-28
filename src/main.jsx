import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: '#04080f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ background: '#0b1422', border: '1px solid #1e2d42', borderRadius: '1rem', padding: '2rem', maxWidth: '520px', width: '100%' }}>
            <div style={{ color: '#f43f5e', fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>App Error</div>
            <div style={{ color: '#8ba3c4', fontSize: '0.875rem', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
              {this.state.error.message}
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{ marginTop: '1.5rem', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
