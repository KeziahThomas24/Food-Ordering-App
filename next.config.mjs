/** @type {import('next').NextConfig} */
const nextConfig = {
        images: {
          remotePatterns: [
            {
              protocol: 'https',
              hostname: 'www.godubrovnik.com',
            },
          ],
        },
};



export default nextConfig;
