/** @type {import('next').NextConfig} */

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

export default nextConfig;