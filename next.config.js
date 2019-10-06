const fs = require('fs')
const path = require('path')
const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const withLess = require('@zeit/next-less')
const withMDX = require('@zeit/next-mdx')({
  extension: /\.mdx?$/
})
const lessToJS = require('less-vars-to-js')
require('dotenv').config()

const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './styles/antd-custom.less'), 'utf8')
)

const {
  API,
  GRAPHQL,
  UPLOAD,
  FILES,
  NAME,
  SLOGAN,
  DESCRIPTION,
  KEYWORDS
} = process.env
module.exports = withPlugins([
  withMDX,
  [withLess, {
    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: themeVariables // make your antd custom effective
    }
  }],
  [withBundleAnalyzer, {
    analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
    analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
      server: {
        analyzerMode: 'static',
        reportFilename: '../../bundles/server.html'
      },
      browser: {
        analyzerMode: 'static',
        reportFilename: '../bundles/client.html'
      }
    }
  }]
], {
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ant-design/icons/lib/dist$': path.resolve(__dirname, './libs/icons.js'),
      moment: 'dayjs'
    }
    if (isServer) {
      const antStyles = /antd\/.*?\/style.*?/
      const origExternals = [...config.externals]
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback()
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback)
          } else {
            callback()
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals)
      ]

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader'
      })
    }
    return config
  },
  poweredByHeader: false,
  pageExtensions: ['js', 'jsx', 'mdx'],
  env: {
    API,
    GRAPHQL,
    UPLOAD,
    FILES,
    NAME,
    SLOGAN,
    DESCRIPTION,
    KEYWORDS,
    VERSION: require('./package.json').version
  }
})
