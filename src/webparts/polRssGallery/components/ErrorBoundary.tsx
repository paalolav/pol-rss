import * as React from 'react';
import styles from './RssFeed.module.scss';
import * as strings from 'RssFeedWebPartStrings';

interface IErrorState {
  hasError: boolean;
  errorMessage: string | null;
  errorStack: string | null;
}

interface IErrorBoundaryProps {
  children: React.ReactNode;
  customFallback?: (error: Error) => React.ReactNode;
}

export class RssErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorState> {
  public state: IErrorState = {
    hasError: false,
    errorMessage: null,
    errorStack: null
  };

  public static getDerivedStateFromError(error: Error): IErrorState {
    return {
      hasError: true,
      errorMessage: error.message,
      errorStack: error.stack || null
    };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('RSS Gallery Error:', {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      component: 'RssErrorBoundary'
    });
  }

  private renderDefaultFallback(): React.ReactNode {
    const { errorMessage } = this.state;
    
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <i className="ms-Icon ms-Icon--ErrorBadge" aria-hidden="true" />
          <h3>{strings.ErrorLoadingFeed}</h3>
          {errorMessage && (
            <details className={styles.errorDetails}>
              <summary>{strings.ErrorParsingFeed}</summary>
              <pre>{errorMessage}</pre>
            </details>
          )}
          <button 
            className={styles.retryButton}
            onClick={() => this.setState({ hasError: false })}
          >
            {strings.RetryButtonText}
          </button>
        </div>
      </div>
    );
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.customFallback 
        ? this.props.customFallback(new Error(this.state.errorMessage || strings.ErrorLoadingFeed))
        : this.renderDefaultFallback();
    }

    return this.props.children;
  }
}

export default RssErrorBoundary;