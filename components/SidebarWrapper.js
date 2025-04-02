"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function SidebarWrapper({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(null); // Avoid default SSR mismatch

  useEffect(() => {
    setIsSidebarOpen(false); // Ensure it's set only after mount
  }, []);

  if (isSidebarOpen === null) return null; // Avoid rendering mismatched content

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`transition-all duration-300 w-full ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        {children}
      </div>
    </div>
  );
}
