"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FilePlus, Database } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const handleCreateData = () => {
    router.push("/create");
  };

  const handleViewData = () => {
    router.push("/data");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-gray-900 dark:text-gray-100 flex items-center justify-center"
      style={{ backgroundImage: "url('/Jan_Schroers.jpg')" }}
    >
      <Card className="p-12 bg-white/80 dark:bg-gray-800/80 shadow-md text-center space-y-8 backdrop-blur-sm">
        <h1 className="text-6xl font-extrabold mb-4 text-gray-800 dark:text-gray-100">
          Welcome to Schroers Lab
        </h1>
        <p className="text-3xl italic text-gray-600 dark:text-gray-300">
          Efficiently manage and organize your data.
        </p>

        <div className="flex gap-8 justify-center mt-3">
          <Button
            onClick={handleCreateData}
            className="flex items-center gap-2 px-4 py-2 text-2xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <FilePlus className="w-8 h-8" />
            Create New Data
          </Button>
          <Button
            onClick={handleViewData}
            className="flex items-center gap-2 px-4 py-2 text-2xl bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          >
            <Database className="w-8 h-8" />
            View Data
          </Button>
        </div>
      </Card>
    </div>
  );
}
