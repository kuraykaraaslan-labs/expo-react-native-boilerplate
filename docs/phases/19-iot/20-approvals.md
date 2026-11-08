# Phase 20 — Approvals on the phone

> Status: ⬜ Planned · P1. Queue steps and quarantined devices need no server change; critical IoT commands are
> 🔴 until next-boilerplate phase 62.1–62.3 is deployed (K7). Owner request 2026-11-08: "critical decisions can be
> approved through the mobile app".

## Goal

One **Approvals** inbox where a manager answers everything that waits on them, from a push notification to a
decision in under ten seconds, safely.

## What lands in the inbox

| Source | What the person decides | Server today |
|---|---|---|
| `approval` queue | Any queue step assigned to me (setting changes, documents, fleet class 3 commands, …) | `GET /api/approvals/steps/mine`, `POST /api/approvals/steps/{stepId}/decide`, `GET /api/approvals/{approvalItemId}` ✅ |
| `iot_provisioning` quarantine | Activate or reject a device that claimed itself and waits in quarantine | quarantine list + activate routes ✅ (read the exact paths first, K8) |
| `iot_rpc` critical commands | Second-person approval of a critical-tier command (open a valve, stop a line, reboot a gateway) before it is queued to the device | 🔴 today a critical command is only *confirmed by its sender*; four-eyes through the queue is server phase 62.1 |
| `iot_ota` rollouts | Resume a rollout that auto-paused at a failure gate | 🔴 server phase 62.2 (route the gate decision through the queue) |

## Screens

1. **Approvals** (drawer + tab badge with the open count): grouped by priority, SLA due time, requester, a one-line
   summary built from the item's entity type. Pull to refresh.
2. **Approval detail**: what will happen if approved, who asked and why, the device's current state from Phase 19
   (for IoT items), the chain so far, comment field. Buttons Approve / Reject, hidden with a reason when M2 applies.
3. **Decision confirm sheet**: biometric prompt (M1); for `metadata.decisionStep` items a passkey assertion over the
   item's challenge (server 62.3); then the result with haptics and a toast.

## Push and deep links

- Server sends an Expo push on a new step for me, an escalation and an SLA breach (62.1 adds the IoT kinds; the
  approval module's in-app notice already exists).
- Payload carries `kind: "approval"` and `approvalItemId` only, never the item's content (lock-screen safe).
- Tapping opens `hermetry://approvals/{approvalItemId}`; when the item belongs to another tenant the app switches
  tenant first (K2 token pair per tenant, no password if signed in before).
- Optional notification actions (Approve / Reject from the notification) are **not** offered: M1 needs the
  re-authentication sheet inside the app.

## Offline and failure

- Deciding needs the network; offline, the buttons are disabled with "You are offline".
- A decision that the server refuses (already decided, expired, not my step) shows the server's reason and reloads.
- The decide call carries an idempotency key so a retry after a timeout cannot decide twice.

## Done when

- Queue steps and quarantine approvals work end to end on a phone (Android and iOS), with push → detail → decide.
- Critical IoT commands work once 62.1–62.3 is deployed; until then the source is hidden behind a feature flag.
- Every decision appears in the server audit log with `channel: mobile`.
- `npm run registry:snapshot` committed.
