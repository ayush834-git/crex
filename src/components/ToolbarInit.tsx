"use client";

import { useEffect } from "react";
import { initToolbar } from "@21st-extension/toolbar";

const stagewiseConfig = {
  plugins: [],
};

export default function ToolbarInit() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      initToolbar(stagewiseConfig);
    }
  }, []);

  return null;
}
