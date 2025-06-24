export interface DonutChartSegment {
  percentage: number;
  color: string;
}

interface SimpleDonutChartProps {
  segments: DonutChartSegment[];
  centerValue: string | number;
}

export const SimpleDonutChart: React.FC<SimpleDonutChartProps> = ({ segments, centerValue }) => {
  const outerRadius = 20;
  const innerRadius = 13;
  const center = 50;
  const gapAngle = 8;

  const calculateSegmentPath = (percentage: number, startAngle: number): string => {
    const totalGaps = segments.length * gapAngle;
    const adjustedPercentage = (percentage / 100) * (360 - totalGaps);
    const angle = adjustedPercentage;
    const endAngle = startAngle + angle;

    const startOuterX = center + outerRadius * Math.cos((startAngle - 90) * (Math.PI / 180));
    const startOuterY = center + outerRadius * Math.sin((startAngle - 90) * (Math.PI / 180));
    const endOuterX = center + outerRadius * Math.cos((endAngle - 90) * (Math.PI / 180));
    const endOuterY = center + outerRadius * Math.sin((endAngle - 90) * (Math.PI / 180));

    const startInnerX = center + innerRadius * Math.cos((endAngle - 90) * (Math.PI / 180));
    const startInnerY = center + innerRadius * Math.sin((endAngle - 90) * (Math.PI / 180));
    const endInnerX = center + innerRadius * Math.cos((startAngle - 90) * (Math.PI / 180));
    const endInnerY = center + innerRadius * Math.sin((startAngle - 90) * (Math.PI / 180));

    const largeArcFlag = angle > 180 ? 1 : 0;

    return `M ${startOuterX},${startOuterY}
            A ${outerRadius},${outerRadius} 0 ${largeArcFlag} 1 ${endOuterX},${endOuterY}
            L ${startInnerX},${startInnerY}
            A ${innerRadius},${innerRadius} 0 ${largeArcFlag} 0 ${endInnerX},${endInnerY}
            Z`;
  };

  let currentAngle = 0;

  return (
    <svg width="100" height="100">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.2" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r={outerRadius + 3} fill="white" filter="url(#shadow)" />
      {segments.map((segment, index) => {
        const path = calculateSegmentPath(segment.percentage, currentAngle);
        const currentPath = path;
        currentAngle += (segment.percentage / 100) * (360 - segments.length * gapAngle) + gapAngle;
        return <path key={index} d={currentPath} fill={segment.color} />;
      })}
      <text x="50" y="51" textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="black" fontWeight={500}>
        {centerValue}
      </text>
    </svg>
  );
};
