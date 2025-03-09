// NoCopy.js
import React, { useEffect } from 'react';

const NoCopy = ({ children }) => {
  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('copy', preventDefault);
    document.addEventListener('paste', preventDefault);
    return () => {
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('copy', preventDefault);
      document.removeEventListener('paste', preventDefault);
    };
  }, []);

  return (
    <div style={{ userSelect: 'none' }}>
      {children}
    </div>
  );
};

export default NoCopy;
