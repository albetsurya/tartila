import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertCircleSvg } from "./ui/CustomIcons";

function isChunkLoadError(error: Error): boolean {
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError|Loading chunk \d+ failed/i.test(
    error.message ?? "",
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Ketika salah satu nilai berubah, boundary di-reset (mis. pathname rute). */
  resetKeys?: unknown[];
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (!this.state.error) return;
    const prevKeys = prevProps.resetKeys ?? [];
    const nextKeys = this.props.resetKeys ?? [];
    const changed =
      prevKeys.length !== nextKeys.length ||
      prevKeys.some((key, index) => key !== nextKeys[index]);
    if (changed) this.reset();
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(error, this.reset);

    const chunk = isChunkLoadError(error);
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#F0FDF4] px-6 text-center">
        <div className="w-full max-w-sm rounded-3xl border-[3px] border-[#134E4A] bg-white p-6 shadow-[4px_4px_0px_#134E4A]">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-[#134E4A] bg-[#FFF0F0] text-2xl">
            <AlertCircleSvg size={28} className="text-[#FF6B6B]" />
          </div>
          <h1 className="font-black text-lg text-[#134E4A]">
            {chunk ? "Gagal memuat halaman" : "Terjadi kesalahan"}
          </h1>
          <p className="mt-2 text-xs font-bold text-[#134E4A]/70">
            {chunk
              ? "Koneksi terputus saat memuat halaman. Muat ulang untuk mencoba lagi."
              : "Ada masalah kecil di aplikasi. Coba muat ulang untuk melanjutkan."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] px-6 py-3.5 font-black text-white shadow-[3px_3px_0px_#134E4A] transition-all active:translate-y-[2px] active:shadow-none"
          >
            Muat Ulang
          </button>
          <button
            onClick={this.reset}
            className="mt-2 w-full rounded-2xl border-[3px] border-[#134E4A] bg-white px-6 py-3 font-black text-[#134E4A] shadow-[3px_3px_0px_#134E4A] transition-all active:translate-y-[2px] active:shadow-none"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }
}
