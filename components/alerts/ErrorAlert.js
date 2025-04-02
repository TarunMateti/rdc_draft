"use client";
import { XCircle } from "lucide-react";

export default function ErrorAlert({ message }) {
  return (
    <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-red-800 dark:text-red-200">
      <XCircle className="w-5 h-5 mr-2 text-red-600 dark:text-red-300" />
      <span>{message}</span>
    </div>
  );
}
