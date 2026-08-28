const TZ = "America/Argentina/Buenos_Aires";

export function fechaLocalAR(date = new Date()): string {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: TZ,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);
    return parts;
}

export function fechaLargaAR(date = new Date()): string {
    return new Intl.DateTimeFormat("es-AR", {
        timeZone: TZ,
        weekday: "long",
        day: "numeric",
        month: "long",
    }).format(date);
}

export function fechaChip(isoDate: string): string {
    const [, mes, dia] = isoDate.split("-");
    return `${Number(dia)}/${Number(mes)}`;
}
