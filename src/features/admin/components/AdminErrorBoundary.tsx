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
        <p className="font-sans text-sm font-bold text-[#1A1A1A]">
          Gagal memuat halaman admin.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-xl border-[2.5px] border-[#1A1A1A] bg-[#FFD60A] px-4 py-2 text-sm font-bold text-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] transition-all hover:bg-[#F5C400] active:translate-y-[2px] active:shadow-none"
        >
          Muat Ulang
        </button>
      </div>
    );
  }
}
