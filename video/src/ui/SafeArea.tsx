import React from 'react';

export const SafeArea: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div style={{ position: 'absolute', inset: 0 }}>{children}</div>;
};
