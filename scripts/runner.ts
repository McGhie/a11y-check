import puppeteer, { Browser, Page } from "puppeteer";
import { commands, CommandResult } from "./commands";
import { getConfig, RunnerConfig } from "./runner-config";
import pa11y from 'pa11y';
import { promises as fs } from 'fs';
import path from 'path';
import htmlReporter from 'pa11y-reporter-html';

export class Runner {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async run(configName: string): Promise<void> {
    const config = getConfig(configName);
    if (!config) {
      throw new Error(`Config "${configName}" not found`);
    }

    console.log(`Running config: ${config.name}`);
    console.log(`Description: ${config.description}`);

    try {
      await this.setup(config);
      await this.executeActions(config);
      await this.pa11yHtmlReport(config);
    } finally {
      await this.cleanup();
    }
  }

  private async setup(config: RunnerConfig): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: config.settings?.headless ?? true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    await fs.mkdir(config.settings.path, { recursive: true });
    this.page = await this.browser.newPage();
    
    if (config.settings?.viewport) {
      await this.page.setViewport(config.settings.viewport);
    }
  }

  private async executeActions(config: RunnerConfig): Promise<void> {
    if (!this.page) throw new Error("Page not initialized");

    for (const action of config.actions) {
      console.log(`Executing: ${action.command} - ${action.description || "No description"}`);
      
      const command = commands[action.command];
      if (!command) {
        throw new Error(`Command "${action.command}" not found`);
      }

      const result: CommandResult = await command(this.page, action.options);
      
      if (result.success) {
        console.log(` ${result.message}`);
      } else {
        console.log(` ${result.message}`);
        if (action.required) {
          throw new Error(`Required action failed: ${action.command}`);
        }
      }
    }
  }

private async pa11yHtmlReport(config: RunnerConfig): Promise<void> {

      const results = await pa11y(this.page.url(), {
        browser: this.browser,
        page: this.page,
        timeout: 120000,
        standard: 'WCAG2AAA'
      } as any);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const reportsDir = path.resolve(process.cwd(), config.settings.path);
    
      const base = `pa11y-${timestamp}`; 
      const html = await htmlReporter.results(results);
      const htmlWithScreenshot = `${html}\n<hr />\n<h2>Screenshot</h2>\n<p><img src="screenshot.png" alt="Page screenshot" style=\"max-width:100%; border:1px solid #ccc\" /></p>`;
      const htmlPath = path.join(reportsDir, `${base}.html`);
      await fs.writeFile(htmlPath, htmlWithScreenshot, 'utf8');

}


  private async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

export async function runConfig(configName: string): Promise<void> {
  const runner = new Runner();
  await runner.run(configName);
}