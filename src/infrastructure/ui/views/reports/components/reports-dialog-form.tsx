import { useState, forwardRef, useImperativeHandle } from "react";
import {
  TextField,
  Switch,
  FormControl,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { dayjs, Dayjs } from "@/infrastructure/dayjs/dayjs";
import clsx from "clsx";
import TagsInput from "@/components/tags-input/tags-input";
import OccurenceSelector from "@/components/ocurrence-selector";
import { RECURRENCE_FREQUENCY } from "@/domain/contants/frequency";
import { MONTHS } from "@/domain/contants/months";
import { recurrenceSentence } from "../utils/recurrence-sentence";
import { dateRangeSentence } from "../utils/daterange-sentence";
import { TimeZoneSelector } from "./timezone-selector";
import { DialogFormRef, ReportsDialogFormData, ReportsDialogFormProps } from "./reports-dialog.form.types";
import { DAYS } from "@/domain/contants/days";

const emailValidator = (email: string): boolean => {
  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regexEmail.test(email);
};

const sortedDays = DAYS.map((day, index) => ({ ...day, index })).sort((dayA) => (dayA.short === "Sun" ? -1 : 1));

const getReportFormDataByFrequency = (
  report: ReportFile | undefined,
  reportType: ReportFile["type"],
  timezone: string
) => {
  const now = timezone ? dayjs().tz(timezone).startOf("day") : dayjs().startOf("day");
  const baseRecurrence = {
    reportName:
      report?.name ??
      `Report ${now.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}`,
    time: report?.recurrence.time ?? "09:00",
    interval: report?.recurrence.interval ?? 1,
    type: report?.type ?? reportType,
    start: report?.recurrence.start ?? now.toDate(),
    end: report?.recurrence.end ?? null,
    recipients: report?.recipients ?? [],
    timezone: report?.recurrence.timezone ?? timezone,
    frequency: report?.recurrence.frequency ?? "DAILY",
  };

  if (report?.recurrence.frequency === "YEARLY") {
    return {
      ...baseRecurrence,
      frequency: "YEARLY" as const,
      months: report.recurrence.months,
      ordinal: report.recurrence.ordinal,
      day: report.recurrence.day,
    };
  }

  if (report?.recurrence.frequency === "MONTHLY") {
    return {
      ...baseRecurrence,
      frequency: "MONTHLY" as const,
      ordinal: report.recurrence.ordinal,
      day: report.recurrence.day,
    };
  }

  if (report?.recurrence.frequency === "WEEKLY") {
    return {
      ...baseRecurrence,
      frequency: "WEEKLY" as const,
      days: report.recurrence.days,
    };
  }

  return {
    ...baseRecurrence,
    frequency: report?.recurrence.frequency ?? "DAILY",
  };
};

export const ReportsDialogForm = forwardRef<DialogFormRef, ReportsDialogFormProps>(
  ({ reportType, disableReportType, report, timezone, isEditing }, ref) => {
    const [formData, setFormData] = useState<ReportsDialogFormData>(
      getReportFormDataByFrequency(report, reportType, timezone)
    );

    const [repeatSchedule, setRepeatSchedule] = useState(report?.recurrence.frequency !== "ONCE");

    useImperativeHandle(ref, () => ({
      submit: () => {
        // Perform any necessary validation here
        return formData;
      },
    }));

    const handleChange = (field: keyof ReportsDialogFormData, value: unknown) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDayChange = (checked: boolean, day: number) => {
      if (formData.frequency !== "WEEKLY") {
        return;
      }
      const updatedDays = checked ? [...(formData.days || []), day] : formData.days?.filter((d) => d !== day);
      if (updatedDays.length > 0) setFormData((prev) => ({ ...prev, days: updatedDays }));
    };

    const handleFrequencyChange = (frequency: Frequency) => {
      if (frequency === "ONCE") {
        setRepeatSchedule(false);
        setFormData((prev) => ({ ...prev, frequency }));
      }

      if (frequency === "DAILY" || frequency === "HOURLY") {
        setFormData((prev) => ({ ...prev, frequency, interval: 1 }));
      }

      if (frequency === "WEEKLY") {
        setFormData((prev) => ({ ...prev, frequency, days: [0] }));
      }

      if (frequency === "MONTHLY") {
        setFormData((prev) => ({ ...prev, frequency, day: 0, interval: 1, ordinal: 1 }));
      }

      if (frequency === "YEARLY") {
        setFormData((prev) => ({ ...prev, frequency, day: 0, interval: 1, ordinal: 1, months: [0] }));
      }
    };

    const handleOrdinalDayChange = (value: { day: number; ordinal: number }) => {
      setFormData((prev) => ({ ...prev, day: value.day, ordinal: value.ordinal }));
    };

    const handleMonthsChange = (months: number[], index: number) => {
      const updatedMonths = months.includes(index) ? months.filter((p) => p !== index) : [...months, index];
      if (!updatedMonths.length) {
        return;
      }
      setFormData((prev) => ({ ...prev, months: updatedMonths }));
    };

    const disableStartDate = (date: Dayjs | null): boolean => {
      if (!date) return false;
      const today = dayjs().startOf("day");
      const startDate = report?.recurrence.start;
      if (isEditing && startDate) {
        return date.isBefore(today) && !date.isSame(startDate, "day");
      } else {
        return date.isBefore(today);
      }
    };

    const disableEndDate = (date: Dayjs | null): boolean => {
      if (!date) return false;
      const endDate = report?.recurrence.end;
      const today = dayjs().startOf("day");
      const startDate = dayjs(formData.start).startOf("day");
      const disableFrom = startDate.isSame(today, "day") ? today.add(1, "day") : today;
      if (isEditing && endDate) {
        return date.isBefore(disableFrom) && !date.isSame(endDate, "day");
      } else {
        return date.isBefore(disableFrom);
      }
    };

    return (
      <div className="tw-space-y-6">
        <div className="tw-mb-6 tw-space-y-6">
          <Typography variant="subtitle1">Report Details</Typography>
          <div className="tw-space-y-4 tw-pl-4">
            <TextField
              label="Report Name *"
              size="small"
              fullWidth
              name="reportName"
              value={formData.reportName}
              onChange={(e) => handleChange("reportName", e.target.value)}
            />
            <TextField
              select
              label="Based on view"
              size="small"
              fullWidth
              disabled={disableReportType}
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <MenuItem value="YARD_CHECK">Assets: Yard Check</MenuItem>
              <MenuItem value="ACCRUED_DISTANCE">Assets: Accrued Distance</MenuItem>
            </TextField>
          </div>
        </div>

        <div className="tw-mb-6 tw-flex tw-items-center tw-space-x-2">
          <Typography variant="subtitle1">Repeat Schedule</Typography>
          <Switch
            checked={repeatSchedule}
            onChange={() => {
              const newRepeatScheduleValue = !repeatSchedule;
              setRepeatSchedule(newRepeatScheduleValue);
              if (!newRepeatScheduleValue) {
                handleChange("frequency", "ONCE");
              } else {
                handleFrequencyChange("DAILY");
              }
            }}
          />
        </div>

        <div className="tw-mb-6 tw-pl-4">
          <p className="tw-text-sm tw-text-gray-600">
            {`Runs ${recurrenceSentence({
              ...formData,
              time: formData.time,
              start: formData.start,
              end: formData.end ?? null,
            })}`}
            .
          </p>
          <p className="tw-text-sm tw-text-gray-600">
            {dateRangeSentence({
              ...formData,
              time: formData.time,
              start: formData.start,
              end: formData.end ?? null,
            })}
            .
          </p>
        </div>

        <div className="tw-mb-6 tw-space-y-4 tw-pl-4">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container direction="column" spacing={2}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 6 }}>
                  <TimeZoneSelector
                    label="Run Report At"
                    time={formData.time}
                    timeZone={formData.timezone}
                    onChangeTime={(value) => handleChange("time", value)}
                    onChangeTimeZone={(value) => handleChange("timezone", value)}
                  />
                </Grid>

                <Grid size={{ xs: 3 }}>
                  <TextField
                    fullWidth
                    disabled={!repeatSchedule}
                    size="small"
                    select
                    label="Every"
                    value={formData.interval}
                    onChange={(e) => handleChange("interval", e.target.value)}
                  >
                    {Array.from({ length: 31 }, (_, index) => index + 1).map((num) => (
                      <MenuItem key={num} value={num}>
                        {num}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <TextField
                    fullWidth
                    disabled={!repeatSchedule}
                    size="small"
                    select
                    label="Unit"
                    value={formData.frequency}
                    onChange={(e) => handleFrequencyChange(e.target.value as Frequency)}
                  >
                    {RECURRENCE_FREQUENCY.map(({ label, value }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              {RECURRENCE_FREQUENCY.slice(-3)
                .map(({ value }) => value)
                .includes(formData.frequency) && (
                <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-rounded-md tw-bg-gray-100 tw-px-2 tw-py-4">
                  {formData.frequency === "WEEKLY" &&
                    sortedDays.map(({ short, index }) => (
                      <FormControlLabel
                        key={short}
                        disabled={!repeatSchedule}
                        slotProps={{ typography: { variant: "body2" } }}
                        control={
                          <Checkbox
                            size="small"
                            disabled={!repeatSchedule}
                            checked={formData.days?.includes(index)}
                            onChange={(e) => handleDayChange(e.target.checked, index)}
                          />
                        }
                        label={short}
                      />
                    ))}
                  <div className="tw-w-full tw-space-y-4">
                    {(formData.frequency === "MONTHLY" || formData.frequency === "YEARLY") && (
                      <div className="tw-flex tw-w-full tw-items-center tw-gap-2">
                        <div className="tw-w-10 tw-text-end tw-text-xs tw-text-gray-600">On the</div>
                        <OccurenceSelector
                          className="tw-grow"
                          value={{ day: formData.day, ordinal: formData.ordinal }}
                          onChange={handleOrdinalDayChange}
                        />
                      </div>
                    )}
                    {formData.frequency === "YEARLY" && (
                      <div className="tw-flex tw-w-full tw-items-center tw-gap-2">
                        <div className="tw-w-10 tw-text-end tw-text-xs tw-text-gray-600">of</div>
                        <FormControl component="fieldset" className="tw-w-full">
                          <div className="tw-rounded-sm tw-border tw-border-blue-300">
                            <Grid container>
                              {MONTHS.map(({ long }, index) => {
                                return (
                                  <Grid size={{ xs: 4 }} key={long}>
                                    <div
                                      className={clsx(
                                        "tw-cursor-pointer tw-border-blue-300 tw-text-center tw-text-primary",
                                        index % 3 !== 2 && "tw-border-r",
                                        index < 9 && "tw-border-b"
                                      )}
                                      onClick={() => handleMonthsChange(formData.months, index)}
                                    >
                                      <div
                                        className={clsx(
                                          "tw-py-2 tw-text-sm",
                                          formData.months?.includes(index) &&
                                            "tw-bg-primary tw-text-white tw-shadow-sm tw-shadow-primary"
                                        )}
                                      >
                                        {long}
                                      </div>
                                    </div>
                                  </Grid>
                                );
                              })}
                            </Grid>
                          </div>
                        </FormControl>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <Grid container spacing={1}>
                <Grid size={{ xs: 6 }}>
                  <DatePicker
                    disabled={!repeatSchedule}
                    className="tw-w-1/2"
                    label="Starting on *"
                    value={dayjs(formData.start)}
                    slotProps={{ textField: { size: "small", fullWidth: true } }}
                    shouldDisableDate={disableStartDate}
                    onChange={(date) => handleChange("start", date?.toDate())}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <DatePicker
                    disabled={!repeatSchedule}
                    className="tw-w-1/2"
                    label="Ending on"
                    value={formData.end ? dayjs(formData.end) : null}
                    slotProps={{ textField: { size: "small", fullWidth: true } }}
                    shouldDisableDate={disableEndDate}
                    onChange={(date) => handleChange("end", date?.toDate())}
                  />
                </Grid>
              </Grid>
            </Grid>
          </LocalizationProvider>
          <p className="tw-mb-6 tw-text-sm tw-text-gray-600">
            After the report is run, the CSV file will be sent to the following email addresses
          </p>
          <TagsInput
            label="Recipients"
            tags={formData.recipients}
            placeholder="Add recipients"
            onChange={(tags: string[]) => setFormData((prev) => ({ ...prev, recipients: tags }))}
            validator={emailValidator}
          />
        </div>
      </div>
    );
  }
);
