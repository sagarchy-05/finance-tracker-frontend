export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB');
};

export const formatMonthYear = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString('default', { month: 'short', year: 'numeric' });
};

export const formatForInput = (dateStr) => {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
};
