# Phase 21 — The phone as an IoT device

> Status: ⬜ Planned · P1. Sending telemetry uses the existing device HTTP API; pairing from a signed-in app is
> 🔴 until next-boilerplate phase 62.4–62.5 is deployed (K7). Owner request 2026-11-08: "the phone can be a device
> and send telemetry to the system".

## Goal

A technician turns their phone into a Hermetry device in one step and it reports location, battery, motion and
manual readings, so a site without fixed sensors still has data, and a person on a round shows on the map.

## Pairing

1. Settings → **Use this phone as a device** → name it (default: the user's name + model).
2. The app asks the server to create a device of the "Mobile phone" profile owned by this user (62.4); the server
   returns a device token once. Stored per M4.
3. Alternative for shared phones: scan a provisioning QR from the web (device profile + provisioning key) and call
   `POST /api/v1/provision` like any other device; no user link.
4. **Unpair** revokes the token on the server (62.5) and deletes it locally.

## What it sends

| Key | Source | When |
|---|---|---|
| `lat`, `lon`, `accuracy`, `speed` | `expo-location` | foreground: every 30 s while moving; background: significant change only (opt-in, M5) |
| `battery`, `charging` | `expo-battery` | every 15 min and on change |
| `network` (wifi / cellular / none) | `expo-network` | on change |
| `shock` (peak g in the window) | `expo-sensors` accelerometer | only while the app is open and the switch is on; a drop above the threshold also sends `fall_detected` |
| manual readings | a form built from the profile's telemetry keys (meter reading, temperature, a yes/no check) | when the person submits |
| photo attachment | camera | with a manual reading, uploaded through `files` (Phase 15), the reading carries the file id |

- Payload: the device HTTP API's JSON telemetry (`ts` + values), batched, at most one request per 10 s, inside the
  tier's `iot_max_telemetry_msgs_per_second`.
- Attributes: `app_version`, `os`, `model` as client attributes on pairing and after an update.
- Commands to the phone (device RPC, `/api/v1/{token}/rpc`): `ring` (play a sound), `locate` (send one fix now),
  `showMessage`. Polled while the app is open; no remote wipe, no hidden tracking.

## Offline buffer

Readings go into an MMKV queue first (max 5 000 points, oldest dropped with a counter sent later as
`dropped_points`), flushed when the network returns, in order, with the original timestamps.

## Background

- iOS: background location with "significant change" only; Android: a foreground service with a visible
  notification while background sending is on. Never silent background tracking.
- Store review texts must say why location is used (a field-work app reporting to the employer's platform).

## Server half (next-boilerplate phase 62)

- 62.4 `POST /iot/devices/mine` — create a "Mobile phone" device owned by the calling user, return its token once;
  idempotent per (user, installation id).
- 62.5 `DELETE /iot/devices/mine/{deviceId}` — revoke and remove; a seeded "Mobile phone" device profile with the
  keys above, its map and alarm rules (no fix for 30 min while on shift, `fall_detected`).

## Done when

- A phone paired from the app appears on the Devices page, shows on a map widget and raises the seeded alarms.
- Readings taken offline arrive later with their own timestamps.
- Each signal can be turned off and stops at once; unpairing removes the device on the server.
- `npm run registry:snapshot` committed.
