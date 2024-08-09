import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

export function isWeekend(date) {
  // convert input date to dayjs object (if it's not already a dayjs object)
  const dayjsDate = dayjs(date);

  // check if date is on a Saturday or Sunday
  const isWeekendDate =
    dayjsDate.day() === 0 || // Sunday
    dayjsDate.day() === 6; // Saturday

  // return the result
  return isWeekendDate;
}
