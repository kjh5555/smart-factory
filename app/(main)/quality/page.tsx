import { Metadata } from "next";
import QualityMetrics from "./_components/QualityMetrics";
import QualityTrends from "./_components/QualityTrends";
import RecentChecks from "./_components/RecentChecks";
import PendingReviews from "./_components/PendingReviews";
import AddQualityButton from "./_components/AddQualityButton";

export const metadata: Metadata = {
  title: "품질 관리",
  description: "스마트 팩토리 품질 관리 시스템",
};

export default function QualityPage() {
  return (
    <div className="space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">품질 관리</h1>
        <AddQualityButton />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QualityMetrics />
        <QualityTrends />
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <RecentChecks />
        <PendingReviews />
      </div>
    </div>
  );
} 