import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://99bb866c9beb1e01b2a4044660ce3e29@o4508374494478336.ingest.de.sentry.io/4508374497624144",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
