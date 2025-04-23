"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

// 위치 타입 정의
interface Location {
  id: string;
  name: string;
  description?: string;
}

// 재고 추가 폼 스키마
const inventoryFormSchema = z.object({
  itemName: z
    .string()
    .min(2, { message: "품목명은 최소 2글자 이상이어야 합니다." })
    .max(50, { message: "품목명은 최대 50글자까지 가능합니다." }),
  quantity: z
    .number({ invalid_type_error: "수량을 입력해주세요." })
    .int({ message: "정수 값을 입력해주세요." })
    .min(0, { message: "수량은 0 이상이어야 합니다." }),
  location: z
    .string()
    .min(1, { message: "위치를 선택해주세요." }),
  minQuantity: z
    .number({ invalid_type_error: "최소 수량을 입력해주세요." })
    .int({ message: "정수 값을 입력해주세요." })
    .min(0, { message: "최소 수량은 0 이상이어야 합니다." }),
  maxQuantity: z
    .number({ invalid_type_error: "최대 수량을 입력해주세요." })
    .int({ message: "정수 값을 입력해주세요." })
    .min(1, { message: "최대 수량은 1 이상이어야 합니다." }),
}).refine(data => data.maxQuantity > data.minQuantity, {
  message: "최대 수량은 최소 수량보다 커야 합니다.",
  path: ["maxQuantity"]
});

type InventoryFormValues = z.infer<typeof inventoryFormSchema>;

interface AddInventoryButtonProps {
  onSuccess: () => void;
}

export default function AddInventoryButton({ onSuccess }: AddInventoryButtonProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  // 위치 데이터 가져오기
  const fetchLocations = async () => {
    setIsLoadingLocations(true);
    try {
      const response = await axios.get('/api/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('위치 데이터 로딩 오류:', error);
      toast.error('위치 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // 다이얼로그가 열릴 때 위치 데이터 가져오기
  useEffect(() => {
    if (open) {
      fetchLocations();
    }
  }, [open]);

  // 폼 설정
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      itemName: "",
      quantity: 0,
      location: "",
      minQuantity: 0,
      maxQuantity: 1000,
    },
  });

  // 폼 제출 처리
  const onSubmit = async (data: InventoryFormValues) => {
    setIsSubmitting(true);
    
    try {
      await axios.post("/api/inventory", data);
      toast.success("재고 항목이 추가되었습니다.");
      form.reset();
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error("재고 추가 오류:", error);
      toast.error("재고 추가 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        재고 추가
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>재고 항목 추가</DialogTitle>
            <DialogDescription>
              새 재고 항목을 시스템에 추가합니다. 모든 필드를 입력해주세요.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="itemName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>품목명</FormLabel>
                    <FormControl>
                      <Input placeholder="품목명 입력" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>수량</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>위치</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoadingLocations}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="위치 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingLocations ? (
                            <SelectItem value="loading" disabled>로딩 중...</SelectItem>
                          ) : (
                            locations.map((location) => (
                              <SelectItem key={location.id} value={location.id}>
                                {location.name} ({location.description})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>최소 수량</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>최대 수량</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1000"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                  취소
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "추가 중..." : "추가"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
} 