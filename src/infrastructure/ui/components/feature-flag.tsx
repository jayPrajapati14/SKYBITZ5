import useFeature from "@/use-feature.hook";
import { Feature as FeatureOption } from "@/infrastructure/feature-flag/feature-flag";

type FeatureProps = {
  flag: string;
  option?: keyof FeatureOption;
  children: React.ReactNode | React.ReactNode[];
};

export const Feature = ({ flag, option, children }: FeatureProps) => {
  const isFeatureEnabled = useFeature(flag, option);
  return isFeatureEnabled ? <>{children}</> : null;
};
