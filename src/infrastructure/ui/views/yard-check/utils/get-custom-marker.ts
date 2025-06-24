export const getCustomMarkerSVG = (color: string) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="31" height="38" viewBox="0 0 31 38" fill="none">
    <g filter="url(#filter0_d_10194_152939)">
    <rect x="1.5" width="28" height="28" rx="7" fill="white"/>
    <rect x="3.5" y="2" width="24" height="24" rx="5" fill="white"/>
    <rect x="3.5" y="2" width="24" height="24" rx="5" stroke="${color}" stroke-width="2"/>
    <path d="M12.166 9.83268H14.666V18.166H12.166V9.83268Z" fill="black" fill-opacity="0.56"/>
    <path d="M16.3327 9.80013L18.8327 9.83268V18.166H16.3327V9.80013Z" fill="black" fill-opacity="0.56"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M22.6934 18.1986C23.4312 16.9616 23.811 15.5618 23.8327 13.9993C23.811 12.4368 23.4312 11.0371 22.6934 9.80013C21.9555 8.54145 20.9572 7.54319 19.6986 6.80534C18.4616 6.06749 17.0618 5.68772 15.4993 5.66602C13.9368 5.68772 12.5371 6.06749 11.3001 6.80534C10.0415 7.54319 9.04319 8.54145 8.30534 9.80013C7.56749 11.0371 7.18772 12.4368 7.16602 13.9993C7.18772 15.5618 7.56749 16.9616 8.30534 18.1986C9.04319 19.4572 10.0415 20.4555 11.3001 21.1934C12.5371 21.9312 13.9368 22.311 15.4993 22.3327C17.0618 22.311 18.4616 21.9312 19.6986 21.1934C20.9572 20.4555 21.9555 19.4572 22.6934 18.1986ZM10.7142 9.21419C11.9946 7.93381 13.5896 7.27192 15.4993 7.22852C17.4091 7.27192 19.0041 7.93381 20.2845 9.21419C21.5649 10.4946 22.2268 12.0896 22.2702 13.9993C22.2268 15.9091 21.5649 17.5041 20.2845 18.7845C19.0041 20.0649 17.4091 20.7268 15.4993 20.7702C13.5896 20.7268 11.9946 20.0649 10.7142 18.7845C9.43381 17.5041 8.77192 15.9091 8.72852 13.9993C8.77192 12.0896 9.43381 10.4946 10.7142 9.21419Z" fill="black" fill-opacity="0.56"/>
    <path d="M18.7617 28.5L15.5 36.6543L12.2383 28.5H18.7617Z" fill="${color}" stroke="white"/>
    <path d="M15.5005 35.5L11.5 25.1484H19.5L15.5005 35.5Z" fill="${color}"/>
    </g>
    <defs>
    <filter id="filter0_d_10194_152939" x="0.5" y="0" width="30" height="38" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset/>
    <feComposite in2="hardAlpha" operator="out"/>
    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10194_152939"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_10194_152939" result="shape"/>
    </filter>
    </defs>
  </svg>
`;
