const STORAGE_KEY = "nutrio:deviceId";

export function getDeviceId(): string {
  let id = localStorage.getItem(STORAGE_KEY);

  if (!id) {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      id = crypto.randomUUID();
    } else {
      // fallback simple UUID-like generator
      id = 'dev-' + Date.now() + '-' + Math.floor(Math.random() * 1000000);
    }

    localStorage.setItem(STORAGE_KEY, id);
  }

  return id;
}
