// Sample config, you can copy this and build your test from it.
// This sample can run with [pnpm test:sample]
// Steps. 
// Clone this file and update to point to your webpage and use naming conventions.
// Import this inside runner-config.ts and add it to the const config.
// Add to package.json in the scripts 
import { RunnerConfig } from "../commands";

// Folder where the html and screenshot will be saved.
const paths = "reports/sample";

export const sampleConfig: RunnerConfig = {
  name: "sample",
  description: "Navigate to sample.",
  settings: {
    headless: true, //False will display the browser on screen for you to view
    viewport: { width: 1366, height: 900 },
    timeout: 120000,
    path: paths
  },
  actions: [
    {
      command: "navigate",
      options: { url: "https://www.abc.net.au/news/justin" },
      description: "Navigate to sample",
      required: true
    },
    {
      command: "waitForTimeout",
      options: { ms: 1000 },
      description: "Wait for page to settle"
    },
     // The path /screenshot.png is hard coded in the runner.ts. 
    // So don't change it unless you want to refactor the runner.ts and all the other configs.
    {
      command: "takeScreenshot",
      options: { 
        path: `${paths}/screenshot.png`, 
        fullPage: true 
      },
      description: "Take screenshot of search results",
      required: true
    }
  ]
}; 