export const formatDate = (date: string | number | Date): string => {
  return new Date(date).toLocaleDateString();
};



