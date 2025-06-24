import { Avatar } from "@mui/material";

type CountProps = {
  count: number | string;
  size?: number;
  color?: string;
  forceShow?: boolean;
};

export function Count({ count, size = 20, color = "secondary.main", forceShow = false }: CountProps) {
  if (count === 0 && !forceShow) return null;

  return (
    <Avatar sx={{ width: size, height: size, bgcolor: color }}>
      <span className="tw-text-xs">{count}</span>
    </Avatar>
  );
}
