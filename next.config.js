/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    serverActions: true,
    swcPlugins: [['@swc-jotai/react-refresh', {}]],
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dorrdxizajloclrfhcth.supabase.co',
        port: ''
      }
    ]
  },
  webpack: (config) => {
    // Ignore node-specific modules when bundling for the browser
    // https://webpack.js.org/configuration/resolve/#resolvealias
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      'onnxruntime-node$': false
    };
    return config;
  }
};

module.exports = nextConfig;
