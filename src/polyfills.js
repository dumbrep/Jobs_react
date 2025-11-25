if (typeof crypto === "undefined") {
  globalThis.crypto = {};
}

if (typeof crypto.randomUUID !== "function") {
  crypto.randomUUID = function () {
    return (
      Math.random().toString(36).substring(2) +
      Date.now().toString(36)
    );
  };
}
