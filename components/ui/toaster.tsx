'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1f2937',
          color: '#f9fafb',
          borderRadius: '0.75rem',
          padding: '0.75rem 1rem'
        }
      }}
    />
  );
}

export default Toaster;
