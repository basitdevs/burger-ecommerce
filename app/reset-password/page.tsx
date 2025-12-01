import { Suspense } from "react";
import ResetPasswordContent from "./ResetPasswordContent";

export default function ResetPasswordPage() {
  return (
    // Bilingual fallback ensures good UX before JS loads
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Loading...</p>
          <p className="text-sm text-gray-500">جاري التحميل...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}