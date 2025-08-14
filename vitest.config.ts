import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        browser: {
            enabled: true,
            provider: "playwright",
            // https://vitest.dev/guide/browser/playwright
            instances: [{ browser: "chromium" }],
        },
        exclude: [
            "**/node_modules/**",
            "**/dist/**",
            "**/.{idea,git,cache,output,temp}/**",
            "/*.config.*",
            "**/test-axe/**",
        ],
    },
});
