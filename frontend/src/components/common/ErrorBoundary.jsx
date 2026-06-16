import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught rendering exception:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-8 text-center rounded-[2rem] bg-red-950/20 border border-red-500/20 glass-panel">
          <svg className="w-10 h-10 text-red-400 mb-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-white font-bold text-lg mb-2">Component Interrupted</h3>
          <p className="text-slate-400 text-sm max-w-sm mb-4">
            A rendering boundary caught a system anomaly. Retrying may resolve the issue.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="btn-glass !py-2 !px-6 !text-[10px]"
          >
            Reset Component
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
