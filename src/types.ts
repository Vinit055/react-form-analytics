import { FieldValues, Path } from "react-hook-form";

export type TrackedFormFieldProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  label: string;
  description?: string;
  children: React.ReactElement;
};

export type AnalyticsContextType = {
  analytics: FormAnalytics;
  trackValidationError: (field: string, error: string) => void;
  trackTabChange: (tab: string) => void;
  trackFormSubmit: () => void;
  trackFormAbandon: () => void;
  resetAnalytics: () => void;
  exportAnalytics: (reason?: "submit" | "tabClose" | "idle") => void;
};

export type FieldAnalytics = {
  id: string; // Field identifier
  validationErrors: string[]; // Track only validation errors
};

export type TabAnalytics = {
  visits: number;
  totalTimeSpent: number; // in milliseconds
  lastVisitTime: number | null;
};

export type FormAnalytics = {
  sessionId: string; // Unique ID for this form session
  formStartTime: number;
  formEndTime: number | null;
  formCompletionTime: number | null;
  fields: Record<string, FieldAnalytics>;
  tabs: Record<string, TabAnalytics>;
  formSubmitted: boolean;
  formAbandoned: boolean;
  validationErrorCount: number;
  exportReason: "submit" | "tabClose" | "idle" | null;
};
