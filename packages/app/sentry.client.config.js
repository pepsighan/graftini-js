import * as Sentry from '@sentry/nextjs';
import config from 'utils/config';

Sentry.init({
  environment: config.ENV,
  dsn: config.NEXT_PUBLIC_SENTRY_DSN,
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});
