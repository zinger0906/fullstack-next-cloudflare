import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
};

export default nextConfig;

// Only run during `next dev`, not during `next build`
if (process.argv.includes("dev")) {
    const { initOpenNextCloudflareForDev } = await import(
        "@opennextjs/cloudflare"
    );
    initOpenNextCloudflareForDev();
}
