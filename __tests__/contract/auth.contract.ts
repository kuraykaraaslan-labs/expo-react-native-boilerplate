import axiosInstance from "@/libs/axios";
import { getToken, setTokens } from "@/libs/secureStorage";
import { DeviceRefreshResponseSchema } from "@/modules/auth/auth.dto";
import { AuthClientService } from "@/modules/auth/auth.service.client";
import { ProfileClientService } from "@/modules/user/profile.service.client";
import { getActiveTenantId } from "@/stores/tenantStore";

// The device session end to end: login → Bearer call → refresh → Bearer call → revoke.
// Needs a test account without 2FA (CONTRACT_EMAIL / CONTRACT_PASSWORD); skipped otherwise.
// The first Bearer call is the regression guard for next-boilerplate 53e7f105e, where every
// device token came back 401 INVALID_TOKEN right after a successful login.

const email = process.env.CONTRACT_EMAIL;
const password = process.env.CONTRACT_PASSWORD;
const run = email && password ? describe : describe.skip;

run("device session contract", () => {
  const tenantId = getActiveTenantId();

  it("a fresh device token works, refreshes, and is refused once revoked", async () => {
    const login = await AuthClientService.deviceLogin({ email: email!, password: password! });
    if (login.otpRequired) throw new Error("the contract account must not use 2FA");
    await setTokens(tenantId, { accessToken: login.accessToken, refreshToken: login.refreshToken });

    // 1. Bearer right after login (53e7f105e).
    await expect(ProfileClientService.getPreferences()).resolves.toBeDefined();

    // 2. Refresh rotates both tokens; the new access token works.
    const res = await axiosInstance.post("/auth/device/refresh", { refreshToken: login.refreshToken }, { skipAuth: true });
    const pair = DeviceRefreshResponseSchema.parse(res.data);
    expect(pair.accessToken).not.toBe(login.accessToken);
    await setTokens(tenantId, pair);
    await expect(ProfileClientService.getPreferences()).resolves.toBeDefined();

    // 3. Revoked on the server: the same token is refused.
    const revoked = await getToken("accessToken", tenantId);
    await AuthClientService.logout(tenantId);
    await expect(
      axiosInstance.get("/auth/me/preferences", { skipAuth: true, headers: { Authorization: `Bearer ${revoked}` } }),
    ).rejects.toMatchObject({ response: { status: 401 } });
  });
});
