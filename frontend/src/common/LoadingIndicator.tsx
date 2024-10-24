import React from "react";
import LoadingIndicator from "./LoadingIndicator";

const SomeComponent: React.FC = () => {
  // Assume we have some loading state
  const isLoading = true; // This would be from your component state

  return (
    <div>{isLoading ? <LoadingIndicator /> : <div>Your content here</div>}</div>
  );
};

export default SomeComponent;
