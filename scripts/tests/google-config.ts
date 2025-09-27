import { RunnerConfig } from "../commands";


const paths = "reports/google";

export const googleConfig: RunnerConfig = {
  name: "Google Search Flow",
  description: "Navigate to Google, search for 'dogs', and wait for results to load",
  settings: {
    headless: false,
    viewport: { width: 1366, height: 900 },
    timeout: 120000,
    path: paths
  },
  actions: [
    {
      command: "navigate",
      options: { url: "https://www.google.com/" },
      description: "Navigate to Google homepage",
      required: true
    },
    {
      command: "waitForSelector",
      options: { selector: "input[name='q'], textarea[name='q']", timeout: 30000 },
      description: "Wait for Google search input field",
      required: true
    },
    {
      command: "waitForTimeout",
      options: { ms: 1000 },
      description: "Wait for page to settle"
    },
    {
      command: "click",
      options: { selector: "#APjFqb" },
      description: "Click on the search input field",
      required: true
    },
    {
      command: "waitForTimeout",
      options: { ms: 500 },
      description: "Wait after clicking search field"
    },
    {
      command: "type",
      options: { 
        selector:  "#APjFqb", 
        text: "dogs",
        delay: 100
      },
      description: "Type 'dogs' in the search field",
      required: true
    },
    {
      command: "waitForTimeout",
      options: { ms: 500 },
      description: "Wait after typing search term"
    },
    {
      command: "pressKey",
      options: { key: "Enter" },
      description: "Press Enter to submit search",
      required: true
    },
    {
      command: "waitForTimeout",
      options: { ms: 20000 },
      description: "Wait for results to fully render"
    },
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