import puppeteer, { Page } from "puppeteer";

export interface CommandOptions {
  [key: string]: any;
}

export interface CommandResult {
  success: boolean;
  message?: string;
  data?: any;
}

export interface Action {
  command: CommandName;
  options: CommandOptions;
  description?: string;
  required?: boolean;
}

export interface RunnerConfig {
  name: string;
  description: string;
  actions: Action[];
  settings?: {
    headless?: boolean;
    viewport?: { width: number; height: number };
    timeout?: number;
    path?: string;
  };
}

export async function navigate(page: Page, options: CommandOptions): Promise<CommandResult> {
  const { url, waitUntil = "networkidle2", timeout = 120000 } = options;
  try {
    await page.goto(url, { waitUntil, timeout });
    return { success: true, message: `Navigated to ${url}` };
  } catch (error) {
    return { success: false, message: `Navigation failed: ${error}` };
  }
}

export async function waitForTimeout(page: Page, options: CommandOptions): Promise<CommandResult> {
  const { ms } = options;
  try {
    await new Promise(resolve => setTimeout(resolve, ms));
    return { success: true, message: `Waited for ${ms}ms` };
  } catch (error) {
    return { success: false, message: `Wait failed: ${error}` };
  }
}

export async function waitForSelector(page: Page, options: CommandOptions): Promise<CommandResult> {
  const { selector, timeout = 30000 } = options;
  try {
    await page.waitForSelector(selector, { timeout });
    return { success: true, message: `Found selector: ${selector}` };
  } catch (error) {
    return { success: false, message: `Selector not found: ${selector}` };
  }
}

export async function click(page: Page, options: CommandOptions): Promise<CommandResult> {
  const { selector } = options;
  try {
    await page.click(selector);
    return { success: true, message: `Clicked: ${selector}` };
  } catch (error) {
    return { success: false, message: `Click failed: ${selector}` };
  }
}

export async function type(page: Page, options: CommandOptions): Promise<CommandResult> {
  const { selector, text, delay = 0 } = options;
  try {
    await page.type(selector, text, { delay });
    return { success: true, message: `Typed "${text}" into: ${selector}` };
  } catch (error) {
    return { success: false, message: `Type failed: ${selector}` };
  }
}

export async function clearAndType(page: Page, options: CommandOptions): Promise<CommandResult> {
  const { selector, text, delay = 0 } = options;
  try {
    await page.click(selector, { clickCount: 3 });
    await page.type(selector, text, { delay });
    return { success: true, message: `Cleared and typed "${text}" into: ${selector}` };
  } catch (error) {
    return { success: false, message: `Clear and type failed: ${selector}` };
  }
}

export async function pressKey(page: Page, options: CommandOptions): Promise<CommandResult> {
  const { key } = options;
  try {
    await page.keyboard.press(key);
    return { success: true, message: `Pressed key: ${key}` };
  } catch (error) {
    return { success: false, message: `Key press failed: ${key}` };
  }
}

export async function clickAndWaitForUrlChange(page: Page, options: CommandOptions): Promise<CommandResult> {
  const { selector, timeout = 60000 } = options;
  try {
    const prevUrl = page.url();
    const waitUrlChange = page.waitForFunction(
      (oldUrl: string) => location.href !== oldUrl, 
      {}, 
      prevUrl
    ).catch(() => null);
    
    await page.click(selector);
    await Promise.race([waitUrlChange, new Promise(resolve => setTimeout(resolve, timeout))]);
    
    return { success: true, message: `Clicked and URL changed: ${selector}` };
  } catch (error) {
    return { success: false, message: `Click and URL change failed: ${selector}` };
  }
}

export async function takeScreenshot(page: Page, options: CommandOptions): Promise<CommandResult> {
  const { path, fullPage = false } = options;
  try {
    await page.screenshot({ path, fullPage });
    return { success: true, message: `Screenshot saved: ${path}` };
  } catch (error) {
    return { success: false, message: `Screenshot failed: ${error}` };
  }
}

export async function evaluateScript(page: Page, options: CommandOptions): Promise<CommandResult> {
  const { script, args = [] } = options;
  try {
    const result = await page.evaluate(script, ...args);
    return { success: true, message: "Script evaluated", data: result };
  } catch (error) {
    return { success: false, message: `Evaluation failed: ${error}` };
  }
}

export const commands = {
  navigate,
  waitForTimeout,
  waitForSelector,
  click,
  type,
  clearAndType,
  pressKey,
  clickAndWaitForUrlChange,
  takeScreenshot,
  evaluateScript
};

export type CommandName = keyof typeof commands;
