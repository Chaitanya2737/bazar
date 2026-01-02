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
        </div>
      );
    }
    return this.props.children;
  }
}
