/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/privacy.html", destination: "/privacy", permanent: true },
      { source: "/terms.html", destination: "/terms", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/alternatives.html", destination: "/alternatives", permanent: true },
      { source: "/admin.html", destination: "/admin", permanent: true },
      { source: "/watch.html", destination: "/watch", permanent: true },
    ];
  },
};

export default nextConfig;
