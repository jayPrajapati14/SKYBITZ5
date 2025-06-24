export function generateTimeSlots() {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const period = hour < 12 ? "am" : "pm";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const id = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const name = `${displayHour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}${period}`;
      slots.push({ id, name });
    }
  }
  return slots;
}
