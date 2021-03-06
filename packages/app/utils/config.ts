export enum Environment {
  Local = 'local',
  Development = 'development',
  Production = 'production',
}

const config = {
  ENV: process.env.NEXT_PUBLIC_ENV,
  USER_GRAPHQL_URL: process.env.NEXT_PUBLIC_USER_GRAPHQL_URL,
  APP_GRAPHQL_URL: process.env.NEXT_PUBLIC_APP_GRAPHQL_URL,
  FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
};

export default config;
