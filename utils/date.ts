const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const date = new Date();

export const currentDate = date.toLocaleString('en-US', {
  hour12: false,
  timeZone: timezone
});

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export const dayOfWeek = days[date.getDay()];
