import { RunnerConfig } from "./commands";
import { googleConfig } from "./tests/google-config";
import { sampleConfig } from "./tests/sample-config";
import { tinkercadConfig } from "./tests/tinkercad-config";


export { RunnerConfig } from "./commands";

export const configs: Record<string, RunnerConfig> = {
  tinkercad: tinkercadConfig,
  google: googleConfig,
  sample: sampleConfig
};

export function getConfig(name: string): RunnerConfig | undefined {
  return configs[name];
}

export function listConfigs(): string[] {
  return Object.keys(configs);
}
