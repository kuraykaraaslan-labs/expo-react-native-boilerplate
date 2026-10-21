import { Platform } from "react-native";
import axiosInstance from "@/libs/axios";
import { RemoteLanguageSchema, type TranslationPlatform } from "@/modules/localization/translation.dto";
import { TranslationClientService } from "@/modules/localization/translation.service.client";

// The two guest routes the app reads (Phase 14A), through the app's own service and schemas.
// The service skips a malformed language on purpose; here every item must parse, so a server
// change that the app would silently hide fails loudly instead.

/** Bundles checked per language and platform — keeps the run under the server's i18n rate limit. */
const MODULES_PER_LANGUAGE = 20;
const PLATFORMS: TranslationPlatform[] = ["ios", "android", "web"];

function asPlatform(os: TranslationPlatform): void {
  Object.defineProperty(Platform, "OS", { value: os, configurable: true });
}

describe.each(PLATFORMS)("localization contract (%s)", (platform) => {
  beforeAll(() => asPlatform(platform));

  it("every language in the list matches the app's schema", async () => {
    const res = await axiosInstance.get("/localization/languages", { params: { platform }, skipAuth: true });
    expect(Array.isArray(res.data.languages)).toBe(true);
    for (const item of res.data.languages) {
      expect(RemoteLanguageSchema.safeParse(item)).toMatchObject({ success: true });
    }
  });

  it("each bundle parses, echoes code and platform, and carries the version the list announced", async () => {
    const languages = await TranslationClientService.getLanguages();
    for (const language of languages) {
      for (const [module, announced] of Object.entries(language.versions).slice(0, MODULES_PER_LANGUAGE)) {
        const bundle = await TranslationClientService.getBundle(language.code, module);
        expect({ code: bundle.code, platform: bundle.platform, module: bundle.module, version: bundle.version }).toEqual({
          code: language.code,
          platform,
          module,
          version: announced,
        });
        for (const key of Object.keys(bundle.messages)) expect(key.startsWith(`${module}.`)).toBe(true);
      }
    }
  });
});
