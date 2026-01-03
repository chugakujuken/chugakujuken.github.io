
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})
module.exports = withMDX({
  output: 'export',
  basePath: '/next-js-migration',
  assetPrefix: '/next-js-migration/',
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
})
