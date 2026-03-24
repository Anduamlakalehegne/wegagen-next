import { Suspense } from "react";
import AboutUsPage from "../../../components/about/AboutUsPage";

export const metadata = {
  title: "About Us | Wegagen Bank",
  description:
    "Learn about Wegagen Bank's history, board of directors, management, core values, and strategic objectives.",
};

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#FF8F12] border-t-transparent animate-spin" />
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Loading…</p>
      </div>
    </div>
  );
}

export default function AboutUs() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AboutUsPage />
    </Suspense>
  );
}
