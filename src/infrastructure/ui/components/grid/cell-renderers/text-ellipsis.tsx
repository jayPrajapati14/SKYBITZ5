export function TextEllipsis({ value }: { value: string | number }) {
  return <div className="tw-overflow-hidden tw-text-ellipsis">{value}</div>;
}
