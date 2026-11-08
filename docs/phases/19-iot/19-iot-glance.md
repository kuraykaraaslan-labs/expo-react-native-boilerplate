# Phase 19 — IoT glance (read-only)

> Status: ⬜ Planned · P1 · no server change. Owner request 2026-11-08 (see [README](README.md)).

## Goal

Give the approver the context of a decision: the tenant's devices, open alarms and one device's latest values,
read-only, on the phone. Editing devices, profiles, dashboards and rules stays on the web.

## Scope

| Screen | Content | Server route (read from the server source before writing DTOs — K8) |
|---|---|---|
| Devices | Search, status filter (online / offline / quarantined), last seen, profile name | `iot_device` list route |
| Device | Name, profile, status, the latest value of each key with its unit, the last 24 h of one chosen key as a sparkline, open alarms of the device | `iot_device` detail + `iot_telemetry` latest / series routes |
| Alarms | Open alarms first, severity colour, device, started at; acknowledge only (clear stays on the web) | `iot_alarm` list + acknowledge routes |

- A new module folder `modules/iot/` (K6): `iot.dto.ts`, `iot.service.client.ts`.
- Live updates: when Phase 16 (Socket.IO transport) is in, subscribe to the `/iot` namespace for the open device;
  until then pull-to-refresh plus a 30 s refresh while the screen is focused.
- Permissions: screens hide when the user lacks the matching `iot.*` read permission; the IoT viewer role
  (read-only, shipped 2026-11-08) is enough for all three.
- Drawer entry "IoT" only when the tenant has the IoT modules on (feature flags, Phase 14).

## Done when

- The three screens render with kui-native components only, in both themes, at phone and tablet width.
- An alarm can be acknowledged; the list updates.
- `npm run registry:snapshot` committed.
