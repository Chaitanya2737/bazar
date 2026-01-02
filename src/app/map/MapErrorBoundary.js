"use client";
import React from "react";

export default class MapErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full text-gray-600">
          Map failed to load. Please refresh.
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <p>Map failed to load. Please refresh.</p>
            <button
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
