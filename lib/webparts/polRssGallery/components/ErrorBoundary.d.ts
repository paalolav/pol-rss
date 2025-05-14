import * as React from 'react';
interface IErrorState {
    hasError: boolean;
    errorMessage: string | null;
    errorStack: string | null;
}
interface IErrorBoundaryProps {
    children: React.ReactNode;
    customFallback?: (error: Error) => React.ReactNode;
}
export declare class RssErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorState> {
    state: IErrorState;
    static getDerivedStateFromError(error: Error): IErrorState;
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    private renderDefaultFallback;
    render(): React.ReactNode;
}
export default RssErrorBoundary;
//# sourceMappingURL=ErrorBoundary.d.ts.map