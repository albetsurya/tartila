import { Component, type ErrorInfo, type ReactNode } from "react";

interface AdminErrorBoundaryProps {
  children: ReactNode;
}

interface AdminErrorBoundaryState {
  error: Error | null;
}

export class AdminErrorBoundary extends Component<
  AdminErrorBoundaryProps,
  AdminErrorBoundaryState
> {
  state: AdminErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AdminErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[AdminErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm font-medium admin-muted">
          Gagal memuat halaman admin.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="admin-accent-bg rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 hover:opacity-90"
        >
          Muat Ulang
        </button>
      </div>
    );
  }
}
