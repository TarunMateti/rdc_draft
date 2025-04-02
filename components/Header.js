"use client";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const router = useRouter();

  return (
    <header className="p-4 bg-gray-200 dark:bg-gray-800 flex justify-between items-center shadow-md">
      <div 
        className="flex items-center space-x-2 cursor-pointer" 
        onClick={() => router.push("/")}
      >
        <img src="Yale_University_Shield_1.svg" alt="Logo" className="w-10 h-10" />
        <h1 className="text-2xl font-bold">Schroers Lab</h1>
      </div>
      <ThemeToggle />
    </header>
  );
}


