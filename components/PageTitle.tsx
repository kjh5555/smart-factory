import React from "react";

interface PageTitleProps {
  title: string;
  description?: string;
}

/**
 * 페이지 제목과 설명을 표시하는 컴포넌트
 */
export default function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
} 