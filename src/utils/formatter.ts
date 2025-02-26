// Months array for date formatting
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Helper function to pad numbers with leading zeros
const pad = (num: number): string => num.toString().padStart(2, '0');

/**
 * Formats a date string to either "Today HH:MM AM/PM" or "DD Month, YYYY" format
 * @param dateString - ISO date string to format
 * @returns formatted date string
 */
export const StringToDateFormatter = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();

  // Check if the date is today
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    let hours = date.getHours();
    const minutes = pad(date.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `Today ${hours}:${minutes} ${ampm}`;
  }

  return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
};

/**
 * Formats a number (timestamp) to date string in UK format
 * @param date - timestamp to format
 * @returns formatted date string
 */
export const DataFormatter = (date: number | null): string => {
  if (date === null) {
    return 'NA';
  }

  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return formattedDate;
};
