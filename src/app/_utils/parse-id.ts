export const parseIdFromParams = (idParam: string | null): number | null => {
  if (!idParam) return null;
  const parsed = Number(idParam);
  return !isNaN(parsed) ? parsed : null;
};
