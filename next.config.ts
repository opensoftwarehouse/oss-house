import { withInternationalization } from "better-intl/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Generates src/i18n/generated.ts from every t.ts under src/ (intl.config.ts),
// and watches them in dev.
export default withInternationalization(nextConfig);
