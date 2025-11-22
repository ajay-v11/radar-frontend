import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // Environment variables with NEXT_PUBLIC_ prefix are automatically
  // exposed to the browser. See .env.local and .env.production for configuration.
  // Type definitions are available in src/env.d.ts
};

export default nextConfig;
