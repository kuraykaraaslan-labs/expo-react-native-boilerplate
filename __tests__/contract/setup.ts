import axiosInstance from "@/libs/axios";

// react-native's jest setup replaces XMLHttpRequest with a mock that never answers; the harness
// needs the network, so the shared instance uses Node's http adapter here (and only here).
axiosInstance.defaults.adapter = "http";
// A next dev server compiles a route on its first hit, which can take longer than the app's 10 s.
axiosInstance.defaults.timeout = 30_000;

jest.mock("sonner-native", () => ({ toast: { error: jest.fn(), success: jest.fn(), info: jest.fn() } }));
