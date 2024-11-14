export const ToSnakeCase = (text: string) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w_]/g, "");
};
