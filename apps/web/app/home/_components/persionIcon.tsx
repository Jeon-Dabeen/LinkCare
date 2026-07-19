type PersonIconProps = {
  className?: string;
  fill?: string;
  stroke?: string;
};

export default function PersonIcon({
  className,
  fill = "none",
  stroke = "none",
}: PersonIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >

      <path d="M31.8809 34C44.1574 34.0001 54.2399 44.1692 54.7402 57H9.02148C9.52183 44.1691 19.6042 34 31.8809 34Z"
      
      fill={fill}
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"/>
      
      <path d="M32.8358 32.6667C39.8699 32.6667 45.5722 26.6971 45.5722 19.3333C45.5722 11.9695 39.8699 6 32.8358 6C25.8018 6 20.0995 11.9695 20.0995 19.3333C20.0995 26.6971 25.8018 32.6667 32.8358 32.6667Z"
      
      fill={fill}
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      />
    </svg>
    
  );
}