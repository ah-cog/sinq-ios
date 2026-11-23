import {defineConfig, devices} from '@playwright/test';
export default defineConfig({
  testDir:'./tests', fullyParallel:false, workers:1, timeout:240000, expect:{timeout:30000},
  use:{baseURL:'http://localhost:8080', ...devices['iPhone 13'], browserName:'chromium', channel:process.env.PLAYWRIGHT_CHANNEL, screenshot:'only-on-failure', trace:'retain-on-failure'},
  projects:[{name:'mobile-chromium'}],
});
