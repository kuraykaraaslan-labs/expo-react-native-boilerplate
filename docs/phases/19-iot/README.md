<!--
ORDER OF AUTHORITY (the higher item wins on conflict):
  1. AGENTS.md (§6 Hard rules · §5 file naming · §0 catalog sync)
  2. next-boilerplate contract — READ-ONLY reference: modules/approval, modules/iot_rpc, modules/iot_device,
     modules/iot_gateway, modules/iot_provisioning, modules/notification_push (their module.json + route files)
  3. next-boilerplate docs/phases/62-mobile-iot/README.md (the server half of this set)
  4. docs/phases/README.md (root index)
  5. THIS FILE
ONLY EXCEPTION: "Owner decisions (fixed)" — a recorded owner decision overrides this file's proposal.
WHERE WE ARE: §Order below
-->

# 19-iot — the Hermetry mobile app for IoT (phase set)

> Written 2026-11-08, English. Owner request (2026-11-08): the mobile app joins the Hermetry platform, people **approve
> critical decisions from it**, and the **phone itself can be a device** that sends telemetry to the system.
> "We will build this too." This set plans it; nothing here is coded yet.

## Why

The web app already holds every piece a field manager waits on: the approval queue (`approval`), high-impact device
commands (`iot_rpc` critical tier), quarantined devices awaiting activation (`iot_provisioning`) and restricted fleet
commands (`fleet` class 3). Today each one needs a browser. On a site, the person who must say yes is usually away
from a desk. The phone is also the one sensor every technician already carries: location, battery, motion, the
camera and a keyboard for manual readings.

## Owner decisions (fixed)

1. **Approvals from the phone** (2026-11-08): critical decisions can be approved or rejected in the app.
2. **The phone can be a device** (2026-11-08): the app can register the phone as an IoT device and send telemetry.
3. Root decisions K1–K8 apply unchanged (device bearer, token pair per tenant, origin + tenant prefix, kui-native
   only, server-gated phases marked 🔴 until the server change is deployed, contract check first).

## Order

| Phase | File | Topic | Server half | Priority |
|---|---|---|---|---|
| 19 | [19-iot-glance.md](19-iot-glance.md) | Read-only IoT glance: devices, alarms, a device's latest values (the context an approver needs) | none, all routes exist | P1 |
| 20 | [20-approvals.md](20-approvals.md) | Approvals inbox: approval queue steps, quarantined devices, critical commands; push deep links; biometric / passkey confirmation | 62.1–62.3 | P1 · 🔴 for critical commands |
| 21 | [21-phone-as-device.md](21-phone-as-device.md) | The phone as an IoT device: pairing, telemetry (location, battery, motion, network, manual readings), offline buffer, background sending | 62.4–62.5 | P1 · 🔴 for pairing |

Phase 19 comes first because an approval without the device's state is a blind click. 20 and 21 are independent
of each other once 19 is in.

## Locked decisions for this set

- **M1 — The app never approves on the bare tap.** Every approve / reject runs a local re-authentication first
  (biometric, falling back to the device PIN, `expo-local-authentication`), and items whose owner marked a
  `metadata.decisionStep` (class 3 fleet commands, critical IoT commands under four-eyes) need a **passkey assertion**
  (Phase 11) bound to that item. Haptics on the decision (AGENTS.md: `expo-haptics` on critical actions).
- **M2 — The requester cannot approve their own item from the phone either.** The server already refuses it; the app
  hides the buttons and says why.
- **M3 — A phone device is an ordinary `iot_device`.** It uses the same device HTTP API as any other device
  (`/api/v1/{token}/telemetry`, `/attributes`, `/rpc`), counts against the same per-tier limits and appears on the
  Devices page with its own device profile ("Mobile phone"). No phone-only ingest path.
- **M4 — Device credentials are not user credentials.** The phone's device token lives in SecureStore under its own
  key (`iotDeviceToken:{tenantId}`), is never sent as `Authorization: Bearer`, and signing out of the app does not
  delete the device; "Unpair this phone" does (the server revokes the token).
- **M5 — Telemetry is opt-in per signal.** Location, motion and background sending each have their own switch, off by
  default, with the OS permission asked only when the switch is turned on. The app shows what it sent last.
