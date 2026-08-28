import { useEffect, useRef, useState, type PointerEvent } from "react";
import { markSwipeHintSeen } from "../lib/swipeHint";

const THRESHOLD_PX = 80;
const THRESHOLD_RATIO = 0.3;

function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface Props {
    nombre: string;
    showHint: boolean;
    disabled?: boolean;
    onPresente: () => void;
    onAusente: () => void;
}

export default function SwipeAlumnoCard({
    nombre,
    showHint,
    disabled,
    onPresente,
    onAusente,
}: Props) {
    const [dx, setDx] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [flyTo, setFlyTo] = useState<number | null>(null);
    const [hintVisible, setHintVisible] = useState(showHint);
    const startX = useRef(0);
    const width = useRef(320);
    const cardRef = useRef<HTMLDivElement>(null);
    const locked = useRef(false);

    useEffect(() => {
        if (!showHint) return;
        const t = window.setTimeout(() => {
            setHintVisible(false);
            markSwipeHintSeen();
        }, 2200);
        return () => window.clearTimeout(t);
    }, [showHint]);

    const finish = (dir: "left" | "right") => {
        if (dir === "right") onPresente();
        else onAusente();
    };

    const commit = (dir: "left" | "right") => {
        if (locked.current || disabled) return;
        locked.current = true;
        markSwipeHintSeen();
        setHintVisible(false);

        if (prefersReducedMotion()) {
            finish(dir);
            return;
        }

        setFlyTo(dir === "right" ? width.current + 40 : -(width.current + 40));
        window.setTimeout(() => finish(dir), 220);
    };

    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (locked.current || disabled || flyTo !== null) return;
        startX.current = e.clientX;
        width.current = cardRef.current?.offsetWidth ?? 320;
        setDragging(true);
    };

    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        if (!dragging || locked.current) return;
        const delta = e.clientX - startX.current;
        if (Math.abs(delta) > 10) {
            e.currentTarget.setPointerCapture(e.pointerId);
        }
        setDx(delta);
    };

    const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
        if (!dragging) return;
        setDragging(false);
        const delta = e.clientX - startX.current;
        const limit = Math.max(THRESHOLD_PX, width.current * THRESHOLD_RATIO);

        if (Math.abs(delta) < 12) {
            setDx(0);
            const rect = cardRef.current?.getBoundingClientRect();
            if (!rect) return;
            const x = e.clientX - rect.left;
            if (x < rect.width / 3) commit("left");
            else if (x > (rect.width * 2) / 3) commit("right");
            return;
        }

        if (delta >= limit) commit("right");
        else if (delta <= -limit) commit("left");
        else setDx(0);
    };

    const fly = flyTo ?? dx;
    const revealPresente = fly > 8;
    const revealAusente = fly < -8;

    return (
        <div
            ref={cardRef}
            className="relative overflow-hidden rounded-card select-none"
        >
            <div
                className="absolute inset-0 flex items-center justify-start bg-lima px-5 font-display text-3xl tracking-wide text-ink"
                style={{ opacity: revealPresente ? 1 : 0 }}
            >
                PRESENTE
            </div>
            <div
                className="absolute inset-0 flex items-center justify-end bg-coral px-5 font-display text-3xl tracking-wide text-crema"
                style={{ opacity: revealAusente ? 1 : 0 }}
            >
                AUSENTE
            </div>
            <div
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={() => {
                    setDragging(false);
                    if (flyTo === null) setDx(0);
                }}
                className="relative bg-cancha px-5 py-5"
                style={{
                    transform: `translateX(${fly}px)`,
                    transition: dragging ? "none" : "transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    touchAction: dragging ? "none" : "pan-y",
                }}
            >
                <p className="text-lg font-semibold text-crema">{nombre}</p>
                {hintVisible && (
                    <p className="mt-1 text-xs text-muted">
                        ← ausente&nbsp;&nbsp;presente →
                    </p>
                )}
            </div>
        </div>
    );
}
