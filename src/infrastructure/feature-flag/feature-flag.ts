export type Feature = {
  enabled: boolean;
  toUser?: number | number[];
  showTextSearch?: boolean;
};

type Features = {
  [key: string]: Feature;
};

type FeatureFlagsConfig = {
  [env: string]: {
    features: Features;
  };
};

import rawFeatureFlagsConfig from "../../../feature-flags.json";

const featureFlagsConfig = rawFeatureFlagsConfig as FeatureFlagsConfig;
type Env = keyof typeof featureFlagsConfig;
const mode = import.meta.env.MODE;

// If the mode is "test", treat it as "development"
const effectiveMode = mode === "test" ? "development" : mode;

export const featureFlags = featureFlagsConfig[effectiveMode as Env].features;
