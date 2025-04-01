# React Form Analytics

## Overview

`react-form-analytics` is an NPM package that provides form analytics for creators. It tracks user interactions with forms and collects key insights such as:

- **Validation Errors:** Tracks fields with validation errors for more than 1 minute while focused.
- **Form Submission Rate:** Calculates successful submission rate.
- **Form Abandonment Rate:** Detects abandoned forms via idle time (10 min), tab changes, and URL redirects.
- **Time Spent on Tabs:** Measures time spent on different form sections.
- **Average Form Completion Time:** Tracks the time taken from form start to submission.
- **Most Error-Prone Field:** Identifies fields with frequent validation issues.

The collected data is visualized in an **Analytics Dashboard**.

This package is built on top of `react-hook-form` to track field changes efficiently.

## Installation

Install the package using npm, yarn, or pnpm:

```sh
npm install react-form-analytics
# or
yarn add react-form-analytics
# or
pnpm add react-form-analytics
```

## Usage

### 1. Wrap the Form with `AnalyticsProvider`

```tsx
import { AnalyticsProvider } from "react-form-analytics";

const UserRegistrationForm = () => {
  return (
    <AnalyticsProvider
      formSchema={formSchema}
      tabs={["personal", "professional", "payment", "experience"]}
    >
      <RegistrationFormInternal />
    </AnalyticsProvider>
  );
};
```

- `tabs` should match the tab names in the form.
- `formSchema` is required and can be defined using a plain object or Zod validation.

### Example Form Schema (Zod)

```tsx
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  skills: z.string().optional(),
});
```

For more details on Zod validation and form schemas, visit [this guide](https://react-hook-form.com/get-started#SchemaValidation).

### 2. Use `TrackedFormField` for Input Fields

```tsx
import { TrackedFormField } from "react-form-analytics";
import { Textarea } from "your-ui-library";

<TrackedFormField
  name="skills"
  label="Skills & Expertise"
  description="Include both technical and soft skills relevant to your profession"
>
  <Textarea
    placeholder="List your key skills (e.g., React, TypeScript, Project Management)"
    className="min-h-32"
  />
</TrackedFormField>;
```

- The `name` prop should match the field name in `formSchema`.
- Any input components or React elements can be used inside `TrackedFormField`.

### 3. Track Analytics with `useAnalytics` Hook

```tsx
import { useAnalytics } from "react-form-analytics";
import { useEffect } from "react";

const { trackTabChange, trackFormSubmit } = useAnalytics();

function onSubmit(data) {
  trackFormSubmit(redirectUrl: "/success");
}

useEffect(() => {
  trackTabChange(activeTab);
}, [activeTab]);
```

**Note:** The `trackFormSubmit` function requires a `redirectUrl` parameter. This is compulsory to avoid creating another form on submit as the form resets, preventing false positive reports in analytics. Users can pass any `redirectUrl`, such as a home page or success page, on submit.

### 4. Example Usage of Tabs

```tsx
<form onSubmit={form.handleSubmit(onSubmit)}>
  <Tabs
    defaultValue="personal"
    className="w-full"
    value={activeTab}
    onValueChange={setActiveTab}
  >
    <TabsList className="grid grid-cols-4 w-full">
      <TabsTrigger value="personal">Personal</TabsTrigger>
      <TabsTrigger value="professional">Professional</TabsTrigger>
      <TabsTrigger value="payment">Payment</TabsTrigger>
      <TabsTrigger value="experience">Experience</TabsTrigger>
    </TabsList>
  </Tabs>
</form>
```

- The tab values here should match the tab names in the `tabs` array of `AnalyticsProvider`.

## API Reference

### `AnalyticsProvider`

| Prop         | Type                  | Description                                  |
| ------------ | --------------------- | -------------------------------------------- |
| `children`   | `ReactNode`           | React children                               |
| `tabs`       | `string[]` (optional) | Tab names (should match form tabs)           |
| `formSchema` | `Record<string, any>` | Required form schema for validation tracking |

### `TrackedFormField`

| Prop          | Type                | Description                                                              |
| ------------- | ------------------- | ------------------------------------------------------------------------ |
| `name`        | `string`            | Field name (must match `formSchema`)                                     |
| `label`       | `string`            | Field label                                                              |
| `description` | `string` (optional) | Additional field information                                             |
| `children`    | `ReactElement`      | Form field component                                                     |
| `errorTimer`  | `number` (optional) | Time in milliseconds before validation error is tracked (default: 60000) |

## Analytics Dashboard Setup

To visualize analytics, set up the dashboard using Docker.

### 1. Create `docker-compose.yaml`

```yaml
version: "3.8"
services:
  clickhouse:
    image: clickhouse/clickhouse-server
    container_name: clickhouseDB
    ports:
      - "8123:8123"
      - "9000:9000"
    environment:
      - CLICKHOUSE_USER=formAnalytics
      - CLICKHOUSE_PASSWORD=test1234
      - CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT=1
    ulimits:
      nofile:
        soft: 262144
        hard: 262144
    restart: unless-stopped

  analytics-dashboard:
    image: ghcr.io/vinit055/formanalyticsdashboard:latest
    container_name: analytics-dashboard
    network_mode: host
    restart: unless-stopped

  form-analytics:
    image: ghcr.io/vinit055/formanalyticsserver:latest
    container_name: analytics-server
    network_mode: host
    restart: unless-stopped
```

### 2. Run the Dashboard

```sh
docker-compose up -d
```

### 3. Access the Dashboard

Visit [http://localhost:8101](http://localhost:8101) to view analytics.

## License

MIT License

## Author

[Vinit Damania / GitHub](https://github.com/Vinit055)
