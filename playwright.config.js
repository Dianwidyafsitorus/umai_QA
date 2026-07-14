// playwright.config.js
module.exports = {
  testDir: './tests',

  use: {
    headless: false,
    browserName: 'chromium',
    viewport: null
  },

  launchOptions: {
    args: ['--start-maximized']
  }
};