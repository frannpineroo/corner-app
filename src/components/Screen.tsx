import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

export function Screen({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-dvh bg-ink px-5 py-6 text-crema">
            <div className="mx-auto w-full max-w-md">{children}</div>
        </div>
    );
}

export function AuthLoading({ label = "Cargando..." }: { label?: string }) {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-ink">
            <LoaderCircle
                className="size-10 animate-spin text-naranja"
                aria-hidden
            />
            <p className="font-sans text-sm text-muted">{label}</p>
        </div>
    );
}

export function IconButton({
    onClick,
    label,
    children,
    tone = "muted",
}: {
    onClick: () => void;
    label: string;
    children: ReactNode;
    tone?: "muted" | "coral" | "naranja" | "lima";
}) {
    const tones = {
        muted: "bg-cancha-2 text-crema hover:bg-cancha",
        coral: "bg-coral text-crema hover:brightness-110",
        naranja: "bg-naranja text-ink hover:brightness-110",
        lima: "bg-lima text-ink hover:brightness-110",
    };

    return (
        <button
            type="button"
            aria-label={label}
            onClick={onClick}
            className={`inline-flex size-10 shrink-0 items-center justify-center rounded-card transition-colors ${tones[tone]}`}
        >
            {children}
        </button>
    );
}
