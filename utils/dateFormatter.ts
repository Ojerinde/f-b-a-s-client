export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // Get day of the week
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];

  // Get day, month, and year
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  return `${dayOfWeek} - ${month}/${day}/${year}`;
}

export function convertTimestampToTime(timestamp: string): string {
  // Convert the timestamp string to a Date object
  const date = new Date(timestamp);

  // Extract hours and minutes from the Date object
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format the time string in AM/PM format
  const timeString = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return timeString;
}
