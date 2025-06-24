import { useUser } from "@/hooks/use-user";
import { featureFlags, Feature } from "@/infrastructure/feature-flag/feature-flag";
import { isUserSpecific } from "@/infrastructure/feature-flag/utils";

const useFeature = (feature: string, option?: keyof Feature): boolean => {
  const featureConfig: Feature = featureFlags[feature];
  const user = useUser();

  // If user or customerId is missing, return false as the feature is not applicable
  if (!user || !user.id) {
    return false;
  }

  if (option) {
    if (featureConfig[option] === undefined) {
      throw new Error(`Option "${option}" not found for feature "${feature}" in config file`);
    }
    return Boolean(featureConfig[option]) && isUserSpecific(featureConfig.toUser, user.id);
  }

  return Boolean(featureConfig.enabled) && isUserSpecific(featureConfig.toUser, user.id);
};

export default useFeature;
