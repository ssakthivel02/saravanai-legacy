import type { CalendarSchedulingAndMeetingCoordination } from "./contracts";
import { validateCalendarSchedulingAndMeetingCoordination } from "./contracts";
import { evaluateCalendarSchedulingAndMeetingCoordination } from "./policy";

export function assessRelease733(value: CalendarSchedulingAndMeetingCoordination) {
  const validationErrors = validateCalendarSchedulingAndMeetingCoordination(value);
  if (validationErrors.length) {
    return {
      valid: false,
      validationErrors,
      decision: { allowed: false, reason: "validation_failed", obligations: ["correct_input"] }
    };
  }
  return {
    valid: true,
    validationErrors: [],
    decision: evaluateCalendarSchedulingAndMeetingCoordination(value)
  };
}
