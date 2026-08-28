const HINT_KEY = "corner-swipe-hint";

export function shouldShowSwipeHint() {
    return localStorage.getItem(HINT_KEY) !== "1";
}

export function markSwipeHintSeen() {
    localStorage.setItem(HINT_KEY, "1");
}
