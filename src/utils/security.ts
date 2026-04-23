export function sanitizeNumericId(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return String(Math.trunc(value));
  }

  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();
  return /^\d+$/.test(trimmed) ? trimmed : '';
}

export function sanitizeSearchParams(
  params: Record<string, string | string[] | undefined>
): Record<string, string> {
  const cleanEntries = Object.entries(params).filter(([, value]) => typeof value === 'string');
  const sanitized = cleanEntries.reduce<Record<string, string>>((acc, [key, value]) => {
    const safeKey = key.replace(/[^\w-]/g, '');
    if (!safeKey || typeof value !== 'string') {
      return acc;
    }

    const safeValue = value.trim().slice(0, 200);
    if (safeValue) {
      acc[safeKey] = safeValue;
    }

    return acc;
  }, {});

  if (sanitized.org_id) {
    sanitized.org_id = sanitizeNumericId(sanitized.org_id);
  }
  if (sanitized.startapp) {
    sanitized.startapp = sanitizeNumericId(sanitized.startapp);
  }
  if (sanitized.telegram_chat_id) {
    sanitized.telegram_chat_id = sanitizeNumericId(sanitized.telegram_chat_id);
  }

  return sanitized;
}

const ORG_ID_STORAGE_KEY = 'kamtar_org_id';
const TELEGRAM_CHAT_ID_STORAGE_KEY = 'kamtar_telegram_chat_id';
export function resolveOrgIdFromSources(...values: unknown[]): string {
  for (const value of values) {
    const sanitized = sanitizeNumericId(value);
    if (sanitized) {
      return sanitized;
    }
  }

  if (typeof window !== 'undefined') {
    try {
      return sanitizeNumericId(window.sessionStorage.getItem(ORG_ID_STORAGE_KEY));
    } catch {
      return '';
    }
  }

  return '';
}

export function persistOrgId(orgId: unknown): string {
  const sanitized = sanitizeNumericId(orgId);

  if (sanitized && typeof window !== 'undefined') {
    try {
      window.sessionStorage.setItem(ORG_ID_STORAGE_KEY, sanitized);
    } catch {
      return sanitized;
    }
  }

  return sanitized;
}

export function persistTelegramChatId(chatId: unknown): string {
  const sanitized = sanitizeNumericId(chatId);

  if (sanitized && typeof window !== 'undefined') {
    try {
      window.sessionStorage.setItem(TELEGRAM_CHAT_ID_STORAGE_KEY, sanitized);
    } catch {
      return sanitized;
    }
  }

  return sanitized;
}

export function resolveTelegramChatIdFromSources(...values: unknown[]): string {
  for (const value of values) {
    const sanitized = sanitizeNumericId(value);
    if (sanitized) {
      return sanitized;
    }
  }

  if (typeof window !== 'undefined') {
    try {
      return sanitizeNumericId(window.sessionStorage.getItem(TELEGRAM_CHAT_ID_STORAGE_KEY));
    } catch {
      return '';
    }
  }

  return '';
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function resolveTelegramChatIdFromInitData(initData: unknown): string {
  if (typeof initData !== 'string' || !initData.trim()) {
    return '';
  }

  try {
    const params = new URLSearchParams(initData);

    const chatRaw = params.get('chat');
    if (chatRaw) {
      const chatObj = safeJsonParse(chatRaw);
      const chatId = isRecord(chatObj) ? sanitizeNumericId(chatObj.id) : '';
      if (chatId) return chatId;
    }

    // Private chatda chat bo'lmaydi, user.id = telegram_chat_id
    const userRaw = params.get('user');
    if (userRaw) {
      const userObj = safeJsonParse(userRaw);
      const userId = isRecord(userObj) ? sanitizeNumericId(userObj.id) : '';
      if (userId) return userId;
    }

    return sanitizeNumericId(params.get('chat_id'));
  } catch {
    return '';
  }
}

type TelegramWebAppLike = {
  initDataUnsafe?: {
    chat?: { id?: unknown };
    user?: { id?: unknown }; // Private chatda user.id = chat_id
    chat_id?: unknown;
  };
  initData?: unknown;
};

export function resolveTelegramChatIdFromWebApp(tgWebApp: unknown): string {
  const webApp = isRecord(tgWebApp) ? (tgWebApp as TelegramWebAppLike) : null;
  const unsafe = webApp?.initDataUnsafe;

  // DEBUG
  console.log('=== DEBUG: resolveTelegramChatIdFromWebApp ===');
  console.log('tgWebApp:', tgWebApp);
  console.log('webApp:', webApp);
  console.log('unsafe:', unsafe);
  console.log('unsafe?.chat?.id:', unsafe?.chat?.id);
  console.log('webApp?.initData:', webApp?.initData);
  console.log('================================================');

  return (
    sanitizeNumericId(unsafe?.chat?.id) ||
    sanitizeNumericId(unsafe?.user?.id) || // Private chatda user.id = chat_id
    sanitizeNumericId(unsafe?.chat_id) ||
    resolveTelegramChatIdFromInitData(webApp?.initData)
  );
}
