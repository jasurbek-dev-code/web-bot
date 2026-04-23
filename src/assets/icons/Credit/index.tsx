import React from "react";

interface CreditCardIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

const index: React.FC<CreditCardIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -8" />
      <path d="M3 10l18 0" />
      <path d="M7 15l.01 0" />
      <path d="M11 15l2 0" />
    </svg>
  );
};

export default index;
