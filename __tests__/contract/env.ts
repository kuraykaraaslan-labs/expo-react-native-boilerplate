// Runs before libs/env validates the environment: the contract harness talks to a real server.
//   CONTRACT_API_URL    origin of a running next-boilerplate (required), e.g. http://localhost:3000
//   CONTRACT_TENANT_ID  tenant to address (default: next-boilerplate's root tenant)
//   CONTRACT_EMAIL / CONTRACT_PASSWORD  a test account; the auth contract is skipped without them
if (!process.env.CONTRACT_API_URL) {
  throw new Error("CONTRACT_API_URL is required, e.g. CONTRACT_API_URL=http://localhost:3000 npm run test:contract");
}
process.env.EXPO_PUBLIC_API_URL = process.env.CONTRACT_API_URL;
process.env.EXPO_PUBLIC_DEFAULT_TENANT_ID = process.env.CONTRACT_TENANT_ID ?? "00000000-0000-4000-8000-000000000000";
