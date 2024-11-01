import React from 'react';

interface SVGProps {
  className?: string;
  transform?: string;
}

export const CornerSVGTopLeft: React.FC<SVGProps> = ({
  className,
  transform,
}) => (
  <svg
    width="9"
    height="9"
    viewBox="0 0 9 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7.86805e-07 0L0 9L1.5 7L1.5 1.5L7 1.5L9 7.86805e-07L7.86805e-07 0Z"
      fill="#D9D9D9"
    />
  </svg>
);

export const CornerSVGBottomRight: React.FC<SVGProps> = ({
  className,
  transform,
}) => (
  <svg
    width="9"
    height="9"
    viewBox="0 0 9 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M9 9L9 0L7.5 2L7.5 7.5L2 7.5L-7.86805e-07 9L9 9Z" fill="#D9D9D9" />
  </svg>
);

export const CornerSVGTopRight: React.FC<SVGProps> = ({
  className,
  transform,
}) => (
  <svg
    width="9"
    height="9"
    viewBox="0 0 9 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9 0L9 9L7.5 7L7.5 1.5L2 1.5L-7.86805e-07 7.86805e-07L9 0Z"
      fill="#D9D9D9"
    />
  </svg>
);

export const CornerSVGBottomLeft: React.FC<SVGProps> = ({
  className,
  transform,
}) => (
  <svg
    width="9"
    height="9"
    viewBox="0 0 9 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7.86805e-07 9L0 0L1.5 2L1.5 7.5L7 7.5L9 9L7.86805e-07 9Z"
      fill="#D9D9D9"
    />
  </svg>
);

export const RectangleRightSVG: React.FC<SVGProps> = ({ className }) => (
  <svg
    width="3"
    height="138"
    viewBox="0 0 3 138"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className={className}
  >
    <g opacity="0.6">
      <path
        d="M2.40389 137.343C2.46309 137.707 3 137.664 3 137.295L3 0.906416C3 0.538299 2.46493 0.493805 2.40412 0.856865L0.677672 11.1654C0.66853 11.2199 0.663936 11.2752 0.663936 11.3305L0.663935 126.558C0.663935 126.612 0.668268 126.666 0.676891 126.719L2.40389 137.343Z"
        fill="white"
      />
      <path
        d="M2.40389 137.343C2.46309 137.707 3 137.664 3 137.295L3 0.906416C3 0.538299 2.46493 0.493805 2.40412 0.856865L0.677672 11.1654C0.66853 11.2199 0.663936 11.2752 0.663936 11.3305L0.663935 126.558C0.663935 126.612 0.668268 126.666 0.676891 126.719L2.40389 137.343Z"
        fill="url(#pattern0_1877_349273)"
      />
    </g>
    <defs>
      <pattern
        id="pattern0_1877_349273"
        patternContentUnits="objectBoundingBox"
        width="0.0313128"
        height="1.92632"
      >
        <use
          xlinkHref="#image0_1877_349273"
          transform="scale(0.0034792 0.214035)"
        />
      </pattern>
      <image
        id="image0_1877_349273"
        width="9"
        height="9"
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAiSURBVHgB3dCxAQAACMKw8v/P4gfKTOdMFXcmAK4Hgv/FLGnkEPHOzzMnAAAAAElFTkSuQmCC"
      />
    </defs>
  </svg>
);

export const RectangleLeftSVG: React.FC<SVGProps> = ({ className }) => (
  <svg
    width="3"
    height="122"
    viewBox="0 0 3 122"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className={className}
  >
    <g opacity="0.6">
      <path
        d="M1.98704 120.786C1.78969 122 -2.88384e-07 121.856 -3.20184e-07 120.626L-3.40458e-06 1.32391C-3.4363e-06 0.0968498 1.78358 -0.0514698 1.98626 1.15873L2.32233 3.16535C2.33147 3.21994 2.33606 3.27518 2.33606 3.33053L2.33606 118.558C2.33606 118.612 2.33173 118.666 2.32311 118.719L1.98704 120.786Z"
        fill="white"
      />
      <path
        d="M1.98704 120.786C1.78969 122 -2.88384e-07 121.856 -3.20184e-07 120.626L-3.40458e-06 1.32391C-3.4363e-06 0.0968498 1.78358 -0.0514698 1.98626 1.15873L2.32233 3.16535C2.33147 3.21994 2.33606 3.27518 2.33606 3.33053L2.33606 118.558C2.33606 118.612 2.33173 118.666 2.32311 118.719L1.98704 120.786Z"
        fill="url(#pattern0_1877_349274)"
      />
    </g>
    <defs>
      <pattern
        id="pattern0_1877_349274"
        patternContentUnits="objectBoundingBox"
        width="0.0313128"
        height="1.92632"
      >
        <use
          xlinkHref="#image0_1877_349274"
          transform="scale(0.0034792 0.214035)"
        />
      </pattern>
      <image
        id="image0_1877_349274"
        width="9"
        height="9"
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAiSURBVHgB3dCxAQAACMKw8v/P4gfKTOdMFXcmAK4Hgv/FLGnkEPHOzzMnAAAAAElFTkSuQmCC"
      />
    </defs>
  </svg>
);

export const StatBgOverview: React.FC<SVGProps> = ({ className }) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 211 130"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMax slice"
    className={className}
  >
    <g filter="url(#filter0_b_40_599041)">
      <path
        d="M0 0H211V112.735L198.14 130H0V0Z"
        fill="#0F121A"
        fill-opacity="0.75"
      />
      <path
        d="M0.5 0.5H210.5V112.569L197.889 129.5H0.5V0.5Z"
        stroke="white"
        stroke-opacity="0.09"
      />
    </g>
    <defs>
      <filter
        id="filter0_b_40_599041"
        x="-4"
        y="-4"
        width="219"
        height="138"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
        <feComposite
          in2="SourceAlpha"
          operator="in"
          result="effect1_backgroundBlur_40_599041"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_backgroundBlur_40_599041"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);


