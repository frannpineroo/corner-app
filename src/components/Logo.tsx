export function Logo({ className = "w-52" }: { className?: string }) {
    return (
        <img
            src="/logo-corner.png"
            alt="Espacio Recreativo Corner"
            className={className}
        />
    );
}
