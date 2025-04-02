"use client";

import { Menu, Home, Plus, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-200 dark:bg-gray-800 p-4 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Toggle Sidebar Button */}
      <Button variant="ghost" onClick={() => setIsOpen(!isOpen)} className="mb-4 text-black dark:text-white">
        <Menu size={24} />
      </Button>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-4">
        <Link href="/" className="flex items-center gap-2 p-2 rounded bg-black text-white hover:bg-gray-700">
          <Home size={18} /> {isOpen && "Home"}
        </Link>
        <Link href="/create" className="flex items-center gap-2 p-2 rounded bg-black text-white hover:bg-gray-700">
          <Plus size={18} /> {isOpen && "Create New Data"}
        </Link>
        <Link href="/data" className="flex items-center gap-2 p-2 rounded bg-black text-white hover:bg-gray-700">
          <Database size={18} /> {isOpen && "Data"}
        </Link>
      </nav>
    </aside>
  );
}
