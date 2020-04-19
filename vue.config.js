module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'views': '@/views',
        'components': '@/components',
        'network': '@/network',
        'assets': '@/assets',
        'common': '@/common'
      }
    }
  }
}