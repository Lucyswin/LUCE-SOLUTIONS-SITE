interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({ 
  variant = "primary", 
  children, 
  fullWidth = false,
  className = "",
  ...props 
}: ButtonProps) {
  const variantClass = `btn-${variant}`;
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button 
      className={`btn ${variantClass} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
