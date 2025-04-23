"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Inventory } from "@prisma/client";

// 위치 타입 정의
interface Location {
  id: string;
  name: string;
  description?: string;
}

// 인벤토리 수정 폼 스키마
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

interface EditInventoryFormProps {
  item: Inventory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function EditInventoryForm({ 
  item, 
  open, 
  onOpenChange, 
  onSuccess 
}: EditInventoryFormProps) {
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

  // 폼 설정
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      itemName: item.itemName,
      quantity: item.quantity,
      location: item.location,
      minQuantity: item.minQuantity,
      maxQuantity: item.maxQuantity,
    },
  });

  // 항목이 변경되면 폼 값 업데이트
  useEffect(() => {
    if (item) {
      form.reset({
        itemName: item.itemName,
        quantity: item.quantity,
        location: item.location,
        minQuantity: item.minQuantity, 
        maxQuantity: item.maxQuantity,
      });
    }
  }, [form, item]);

  // 다이얼로그가 열릴 때 위치 데이터 가져오기
  useEffect(() => {
    if (open) {
      fetchLocations();
    }
  }, [open]);

  // 폼 제출 처리
  const onSubmit = async (data: InventoryFormValues) => {
    setIsSubmitting(true);
    
    try {
      await axios.put(`/api/inventory/${item.id}`, data);
      toast.success("재고 항목이 수정되었습니다.");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("재고 수정 오류:", error);
      toast.error("재고 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>재고 항목 수정</DialogTitle>
          <DialogDescription>
            기존 재고 항목 정보를 수정합니다. 모든 필드를 확인해주세요.
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
                              {location.name}
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
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "수정 중..." : "저장"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 