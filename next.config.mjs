/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'dd0vjyvor455isbt.public.blob.vercel-storage.com',
                port: '',
                pathname: '/images/**',
                search: '',
            },
        ],
    },
};

export default nextConfig;
