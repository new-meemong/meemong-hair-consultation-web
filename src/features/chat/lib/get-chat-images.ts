export const getChatImages = (message: string) => {
  return message.split(',').map((url) => url.trim());
};
