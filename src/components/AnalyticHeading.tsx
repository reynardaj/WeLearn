import React from 'react';

interface Heading3Props {
  children: React.ReactNode;
  className?: string;
}

const heading3: React.FC<Heading3Props> = ({ children, className = "" }) => {
  return (
    <h3 className={`text-xl font-semibold ${className}`}>
      {children}
    </h3>
  );
};

export default heading3;