import { RunnerConfig } from "../commands";

const paths = "reports/tinker";

export const tinkercadConfig: RunnerConfig = {
  name: "Tinkercad Login Flow",
  description: "Navigate to Tinkercad login, click personal accounts, and attempt form interactions",
  settings: {
    headless: true,
    viewport: { width: 1366, height: 900 },
    timeout: 120000,
    path: paths
  },
  actions: [
    {
      command: "navigate",
      options: { url: "https://www.tinkercad.com/login" },
      description: "Navigate to Tinkercad login page",
      required: true
    },
    {
      command: "waitForSelector",
      options: { selector: "#signInPersonalAccounts", timeout: 30000 },
      description: "Wait for personal accounts button",
      required: true
    },
    {
      command: "clickAndWaitForUrlChange",
      options: { selector: "#signInPersonalAccounts", timeout: 60000 },
      description: "Click personal accounts and wait for navigation",
      required: true
    },
    {
      command: "waitForTimeout",
      options: { ms: 1000 },
      description: "Wait for page to settle"
    },
    {
      command: "evaluateScript",
      options: {
        script: `() => {
          const buttons = Array.from(document.querySelectorAll("button"));
          const target = buttons.find(b => /accept|i agree/i.test(b.textContent || ""));
          if (target) {
            target.click();
            return true;
          }
          return false;
        }`
      },
      description: "Try to dismiss cookie banner"
    },
    {
      command: "waitForTimeout",
      options: { ms: 500 },
      description: "Wait after cookie banner"
    },
    {
      command: "evaluateScript",
      options: {
        script: `() => {
          const dashboardLink = document.querySelector("a[href*=\"dashboard\"]");
          if (dashboardLink) {
            dashboardLink.click();
            return true;
          }
          return false;
        }`
      },
      description: "Try to click dashboard link if present"
    },
    {
      command: "waitForTimeout",
      options: { ms: 1500 },
      description: "Wait after dashboard link click"
    },
    {
      command: "evaluateScript",
      options: {
        script: `() => {
          const emailInput = document.querySelector("#email, input[name=\"email\"], input[type=\"email\"]");
          if (emailInput) {
            emailInput.click();
            emailInput.value = "";
            emailInput.value = "user@example.com";
            return true;
          }
          return false;
        }`
      },
      description: "Try to fill email field if present"
    },
    {
      command: "waitForTimeout",
      options: { ms: 300 },
      description: "Wait after email input"
    },
    {
      command: "evaluateScript",
      options: {
        script: `() => {
          const pwdInput = document.querySelector("#password, input[name=\"password\"], input[type=\"password\"]");
          if (pwdInput) {
            pwdInput.click();
            pwdInput.value = "";
            pwdInput.value = "MyS3cret!";
            pwdInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
            return true;
          }
          return false;
        }`
      },
      description: "Try to fill password and submit if present"
    },
    {
      command: "waitForTimeout",
      options: { ms: 2000 },
      description: "Wait after form submission"
    },
    {
      command: "takeScreenshot",
      options: { 
        path: `${paths}/screenshot.png`, 
        fullPage: true 
      },
      description: "Take final screenshot",
      required: true
    }
  ]
}; 