module.exports = {
  webpack: (config, options, webpack) => {
    // Changes the name of the entrypoint from
    // 'src/index.js' to 'bin/www.js'
    config.entry.main = [
      './bin/www.js'
    ]

    return config
  }
}
