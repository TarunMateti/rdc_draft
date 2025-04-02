"use client";
import { CheckCircle } from "lucide-react";

export default function SuccessAlert({ message }) {
  return (
    <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-green-800 dark:text-green-200">
      <CheckCircle className="w-5 h-5 mr-2 text-green-600 dark:text-green-300" />
      <span>{message}</span>
    </div>
  );
}
