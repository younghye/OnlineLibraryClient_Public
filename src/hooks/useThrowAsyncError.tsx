import { useState } from "react";

// Trigger normal React re-render, and then re-throw errors back into the re-render lifecycle.
// ErrorBoundary can catch them as any other error.
export const useThrowAsyncError = () => {
  const [, setState] = useState();

  return (error: any) => {
    setState(() => {
      throw error;
    });
  };
};
