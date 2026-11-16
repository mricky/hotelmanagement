import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center justify-center">
          <div className="max-w-xl w-full bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-2xl">
            <h2 className="text-xl font-black text-rose-500 mb-2">React Runtime Component Exception</h2>
            <p className="text-xs text-slate-300 mb-4">{this.state.error?.toString()}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-[#EF3F09] text-white text-xs font-bold"
            >
              Reload System
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
