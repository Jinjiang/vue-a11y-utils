let lastId = Date.now() % 100000;

export const genId = (content?: string): string => {
  if (content) {
    return content;
  }
  const now = Date.now() % 100000;
  if (now <= lastId) {
    lastId++;
  } else {
    lastId = now;
  }
  return `v-${lastId}`;
};
