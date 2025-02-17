/** @type {import('next').NextConfig} */

const CURRENT_ENVIRONMENT = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.BLOB_STORAGE_URL,
                port: '',
                pathname: '/images/**',
                search: '',
            },
        ],
    },
};

if (CURRENT_ENVIRONMENT !== 'development') {
    nextConfig.env = {
        PUBLIC_API_URL: `https://${process.env.VERCEL_BRANCH_URL}`,
    };
}

export default nextConfig;