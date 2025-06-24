export function dateRangeSentence(recurrence: Omit<ReportFile["recurrence"], "timezone">): string {
  if (recurrence.frequency === "ONCE" && recurrence.start)
    return `One time run on ${recurrence.start.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })}`;

  const formattedStartDate = recurrence.start?.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  let sentence = `Starts on ${formattedStartDate}`;

  if (recurrence.end) {
    const endDate = new Date(recurrence.end);
    const formattedEndDate = endDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    sentence += ` and ends on ${formattedEndDate}`;
  } else {
    sentence += " and never ends";
  }

  return sentence;
}
