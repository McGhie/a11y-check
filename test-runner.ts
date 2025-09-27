import { runConfig } from "./scripts/runner";

async function main() {
  const configName = process.argv[2];
  
  if (!configName) {
    console.log("Usage: ts-node test-runner.ts <config-name>");
    console.log("Available configs: tinkercad");
    process.exit(1);
  }

  try {
    await runConfig(configName);
    console.log("Config completed successfully");
  } catch (error) {
    console.error("Config failed:", error);
    process.exit(1);
  }
}

main();
