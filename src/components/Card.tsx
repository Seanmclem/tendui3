import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  className = "",
  padding = "md",
}) => {
  const paddingClasses = {
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  const baseClasses = "bg-white rounded-lg shadow-md border border-gray-200";
  const classes = `${baseClasses} ${paddingClasses[padding]} ${className}`;

  return (
    <div className={classes}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
