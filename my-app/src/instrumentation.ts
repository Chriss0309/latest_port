export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV === "development") {
    const originalHandler = process.listeners("unhandledRejection").slice();

    process.removeAllListeners("unhandledRejection");

    process.on("unhandledRejection", (reason, promise) => {
      if (
        reason instanceof Error &&
        reason.message.startsWith('unrecognized HMR message')
      ) {
        return;
      }
      originalHandler.forEach((handler) => {
        if (typeof handler === "function") {
          handler(reason, promise);
        }
      });
    });
  }
}
