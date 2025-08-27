// utils/storage.js
export const setWithExpiry = (key, value, ttl) => {
  const now = new Date();
  const item = {
    value,
    startTime: now.toISOString(),          // Log start time
    expiry: now.getTime() + ttl,           // Expiry timestamp
    endTime: new Date(now.getTime() + ttl).toISOString(), // Log expected logout time
  };

  localStorage.setItem(key, JSON.stringify(item));
};

export const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      console.log(`⏳ Session expired | Start: ${item.startTime} | End: ${item.endTime}`);
      localStorage.removeItem(key); // expired
      return null;
    }

    return item;
  } catch {
    return null;
  }
};
