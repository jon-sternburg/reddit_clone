/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['b.thumbs.redditmedia.com', 'styles.redditmedia.com', 'i.redd.it', 'a.thumbs.redditmedia.com', 'i.imgur.com'],
  },
  experimental: {
    appDir: true,
    serverActions: true
  }
};

