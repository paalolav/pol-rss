import * as React from 'react';
import styles from './RssFeed.module.scss';
import * as strings from 'RssFeedWebPartStrings';
export class RssErrorBoundary extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            hasError: false,
            errorMessage: null,
            errorStack: null
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            errorMessage: error.message,
            errorStack: error.stack || null
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error('RSS Gallery Error:', {
            error,
            errorInfo,
            timestamp: new Date().toISOString(),
            component: 'RssErrorBoundary'
        });
    }
    renderDefaultFallback() {
        const { errorMessage } = this.state;
        return (React.createElement("div", { className: styles.errorContainer },
            React.createElement("div", { className: styles.errorContent },
                React.createElement("i", { className: "ms-Icon ms-Icon--ErrorBadge", "aria-hidden": "true" }),
                React.createElement("h3", null, strings.ErrorLoadingFeed),
                errorMessage && (React.createElement("details", { className: styles.errorDetails },
                    React.createElement("summary", null, strings.ErrorParsingFeed),
                    React.createElement("pre", null, errorMessage))),
                React.createElement("button", { className: styles.retryButton, onClick: () => this.setState({ hasError: false }) }, strings.RetryButtonText))));
    }
    render() {
        if (this.state.hasError) {
            return this.props.customFallback
                ? this.props.customFallback(new Error(this.state.errorMessage || strings.ErrorLoadingFeed))
                : this.renderDefaultFallback();
        }
        return this.props.children;
    }
}
export default RssErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map