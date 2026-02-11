/**
 * Error Boundary Component
 * Catches React rendering errors and displays fallback UI
 * Prevents blank screens when components crash
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    // Optionally reload the page
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI when error occurs
      return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
          <div className="bg-dark-card border border-dark-border rounded-xl p-8 max-w-2xl w-full">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-red-500/10 p-3 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
                <p className="text-gray-400 mt-1">
                  {this.props.message || 'The application encountered an unexpected error'}
                </p>
              </div>
            </div>

            <div className="bg-dark-bg rounded-lg p-4 mb-6">
              <p className="text-gray-300 text-sm leading-relaxed">
                We're sorry for the inconvenience. This error has been logged and we'll work to fix it.
                In the meantime, you can try:
              </p>
              <ul className="list-disc list-inside text-gray-400 text-sm mt-3 space-y-2">
                <li>Refreshing the page</li>
                <li>Clearing your browser cache</li>
                <li>Checking your internet connection</li>
                <li>Trying again in a few minutes</li>
              </ul>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="bg-dark-bg rounded-lg p-4 mb-6">
                <summary className="text-red-400 font-mono text-xs cursor-pointer mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="text-red-300 font-mono text-xs whitespace-pre-wrap overflow-auto max-h-64">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex space-x-4">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-dark-border hover:bg-dark-hover text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Render children normally when no error
    return this.props.children;
  }
}

export default ErrorBoundary;
