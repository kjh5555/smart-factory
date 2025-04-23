"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { CheckCircle, CheckSquare, PackageCheck, BarChart } from "lucide-react";

// 활동 타입 정의
interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: 'production' | 'quality' | 'inventory' | 'equipment';
}

export default function ActivityTimeline() {
  // 임시 활동 데이터
  const activities: Activity[] = [
    {
      id: '1',
      title: '생산 계획 완료',
      description: '제품 A의 생산 계획이 완료되었습니다.',
      timestamp: new Date(Date.now() - 30 * 60000), // 30분 전
      type: 'production'
    },
    {
      id: '2',
      title: '품질 검사 합격',
      description: '제품 B가 품질 검사를 통과했습니다.',
      timestamp: new Date(Date.now() - 120 * 60000), // 2시간 전
      type: 'quality'
    },
    {
      id: '3',
      title: '재고 입고',
      description: '원자재 C가 입고 처리되었습니다.',
      timestamp: new Date(Date.now() - 240 * 60000), // 4시간 전
      type: 'inventory'
    },
    {
      id: '4',
      title: '설비 점검 완료',
      description: '설비 D의 정기 점검이 완료되었습니다.',
      timestamp: new Date(Date.now() - 480 * 60000), // 8시간 전
      type: 'equipment'
    }
  ];

  // 활동 타입에 따른 아이콘 선택
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'production':
        return <BarChart className="h-5 w-5 text-blue-500" />;
      case 'quality':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'inventory':
        return <PackageCheck className="h-5 w-5 text-amber-500" />;
      case 'equipment':
        return <CheckSquare className="h-5 w-5 text-purple-500" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  // 활동 타입에 따른 배지 텍스트
  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'production':
        return <Badge className="bg-blue-500">생산</Badge>;
      case 'quality':
        return <Badge className="bg-green-500">품질</Badge>;
      case 'inventory':
        return <Badge className="bg-amber-500">재고</Badge>;
      case 'equipment':
        return <Badge className="bg-purple-500">설비</Badge>;
      default:
        return <Badge>기타</Badge>;
    }
  };

  // 타임라인 항목 렌더링
  const renderTimelineItem = (activity: Activity, index: number) => {
    const isLast = index === activities.length - 1;
    
    return (
      <div key={activity.id} className="relative pl-8 pb-6">
        {/* 연결선 */}
        {!isLast && (
          <div className="absolute left-[19px] top-8 bottom-0 w-px bg-muted" />
        )}
        
        {/* 아이콘 원 */}
        <div className="absolute left-0 top-0 bg-background p-1 rounded-full border">
          {getActivityIcon(activity.type)}
        </div>
        
        {/* 내용 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{activity.title}</h4>
            {getActivityBadge(activity.type)}
          </div>
          <p className="text-sm text-muted-foreground">
            {activity.description}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(activity.timestamp, {
              addSuffix: true,
              locale: ko,
            })}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">최근 활동</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-1">
          {activities.map((activity, index) => renderTimelineItem(activity, index))}
        </div>
      </CardContent>
    </Card>
  );
} 