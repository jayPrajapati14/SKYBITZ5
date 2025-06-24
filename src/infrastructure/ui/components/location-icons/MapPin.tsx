type CustomIconProps = {
  color?: string;
  value?: string | number;
  size?: number;
};

export const MapPin: React.FC<CustomIconProps> = ({ color = "#1E88E5", value = "00", size = 36 }) => {
  const displayValue = value.toString().padStart(2, "0").slice(-2);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 31 36" fill="none">
      <g filter="url(#filter0_d_7992_152360)">
        <rect x="1" width="29" height="26" rx="5" fill="white" />
        <rect x="3.5" y="2.5" width="24" height="21" rx="2.5" fill="white" />
        <rect x="3.5" y="2.5" width="24" height="21" rx="2.5" stroke={color} strokeWidth="3" />
        {/* Left digit */}
        <text x="10" y="15" fill="black" fillOpacity="0.38" fontSize="8" fontFamily="Arial, sans-serif">
          {displayValue[0]}
        </text>
        {/* Right digit */}
        <text x="17" y="15" fill="black" fillOpacity="0.87" fontSize="8" fontFamily="Arial, sans-serif">
          {displayValue[1]}
        </text>
        <path d="M18.7615 26.5L15.5 34.6537L12.2385 26.5H18.7615Z" fill={color} stroke="white" />
        <path d="M15.5005 33.5L11.5 23.1484H19.5L15.5005 33.5Z" fill={color} />
      </g>
      <defs>
        <filter
          id="filter0_d_7992_152360"
          x="0"
          y="0"
          width="31"
          height="36"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_7992_152360" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_7992_152360" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};
