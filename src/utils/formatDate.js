// utils/formatDate.js

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB'); // e.g., 03/04/2025
};

export const formatMonthYear = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g., Apr 2025
};

export const formatForInput = (dateStr) => {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0]; // e.g., 2025-04-03 (for input[type="date"])
};
