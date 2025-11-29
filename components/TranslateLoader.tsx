import { Loader2 } from "lucide-react";

export default function TranslateLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-black/80">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Translating...
        </p>
      </div>
    </div>
  );
}