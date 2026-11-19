/** Holds the signed-in user's id and JWT; the token is what authenticates every API call. */
let currentUserId: string | null = null;
let currentToken: string | null = null;
let onExpired: (() => void) | null = null;

export const session = {
  set(userId: string | null, token?: string | null) {
    currentUserId = userId;
    currentToken = token ?? null;
  },
  userId: () => currentUserId,
  token: () => currentToken,
  /** Registered by AuthProvider so a 401 signs the user out. */
  onExpired(cb: (() => void) | null) {
    onExpired = cb;
  },
  expire() {
    currentUserId = null;
    currentToken = null;
    onExpired?.();
  },
};
