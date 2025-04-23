'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

// 생산 계획 추가 폼 스키마
const productionSchema = z.object({
  productId: z.string().min(1, "제품을 선택해주세요"),
  quantity: z.string().min(1, "수량을 입력해주세요"),
  startTime: z.string().min(1, "시작 시간을 입력해주세요"),
  endTime: z.string().min(1, "종료 시간을 입력해주세요"),
});

type ProductionForm = z.infer<typeof productionSchema>;

interface Product {
  id: string;
  name: string;
  description: string;
  baseQuantity: number;
  baseDays: number;
}

export default function AddProductionDialog() {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();
  
  // 제품 목록 조회
  const { data: products } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => axios.get('/api/products').then(res => res.data),
  });
  
  // 종료 시간 계산 함수
  const calculateEndTime = (startTime: Date, baseQuantity: number, quantity: number, baseDays: number) => {
    const multiplier = quantity / baseQuantity;
    const totalDays = Math.ceil(baseDays * multiplier);
    const endTime = new Date(startTime);
    endTime.setDate(endTime.getDate() + totalDays);
    
    // 날짜를 YYYY-MM-DDTHH:mm 형식으로 변환
    const year = endTime.getFullYear();
    const month = String(endTime.getMonth() + 1).padStart(2, '0');
    const day = String(endTime.getDate()).padStart(2, '0');
    const hours = String(endTime.getHours()).padStart(2, '0');
    const minutes = String(endTime.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDialogOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // 현재 한국 시간을 직접 가져오기
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      const currentTime = `${year}-${month}-${day}T${hours}:${minutes}`;
      form.setValue("startTime", currentTime);
      
      if (selectedProduct) {
        const quantity = Number(form.getValues("quantity"));
        const endTime = calculateEndTime(now, selectedProduct.baseQuantity, quantity, selectedProduct.baseDays);
        form.setValue("endTime", endTime);
      }
    }
  };

  const form = useForm<ProductionForm>({
    resolver: zodResolver(productionSchema),
    defaultValues: {
      productId: "",
      quantity: "",
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date().toISOString().slice(0, 16),
    },
  });

  // 제품 선택 시 해당 제품의 정보 저장
  const handleProductChange = (productId: string) => {
    const product = products?.find(p => p.id === productId);
    setSelectedProduct(product || null);
    form.setValue("productId", productId);
    form.setValue("quantity", product?.baseQuantity.toString() || "");
    
    // 시작 시간과 종료 시간 설정
    const startTime = form.getValues("startTime");
    if (startTime && product) {
      const endTime = calculateEndTime(new Date(startTime), product.baseQuantity, Number(form.getValues("quantity")), product.baseDays);
      form.setValue("endTime", endTime);
    }
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedProduct) return;

    const quantity = Number(form.getValues("quantity"));
    const endTime = calculateEndTime(new Date(e.target.value), selectedProduct.baseQuantity, quantity, selectedProduct.baseDays);
    form.setValue("endTime", endTime);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedProduct) return;

    const inputValue = Number(e.target.value);
    // baseQuantity의 배수로 조정
    const adjustedValue = Math.ceil(inputValue / selectedProduct.baseQuantity) * selectedProduct.baseQuantity;
    form.setValue("quantity", adjustedValue.toString());

    // 종료 시간 계산
    const startTime = form.getValues("startTime");
    if (startTime) {
      const endTime = calculateEndTime(new Date(startTime), selectedProduct.baseQuantity, adjustedValue, selectedProduct.baseDays);
      form.setValue("endTime", endTime);
    }
  };

  const mutation = useMutation({
    mutationFn: (values: ProductionForm) => {
      const quantity = parseInt(values.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error("수량은 0보다 큰 숫자여야 합니다");
      }
      
      const formattedData = {
        ...values,
        quantity,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
        status: "PLANNED",
      };
      return axios.post('/api/productions', formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productions'] });
      setOpen(false);
      form.reset();
      setSelectedProduct(null);
    },
  });

  const onSubmit = (values: ProductionForm) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          생산 계획 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>생산 계획 추가</DialogTitle>
          <div className="space-y-2">
            <DialogDescription>
              새로운 생산 계획의 정보를 입력해주세요.
            </DialogDescription>
            {selectedProduct && (
              <p className="text-sm text-muted-foreground">
                기준 수량: {selectedProduct.baseQuantity}개 / 
                기준 생산일: {selectedProduct.baseDays}일
              </p>
            )}
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제품</FormLabel>
                  <Select onValueChange={handleProductChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="제품을 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products?.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      min={selectedProduct?.baseQuantity || 1}
                      step={selectedProduct?.baseQuantity || 1}
                      placeholder={selectedProduct ? `${selectedProduct.baseQuantity}` : "수량 입력"}
                      {...field}
                      onChange={handleQuantityChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>시작 시간</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleStartTimeChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>종료 시간</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
                      {...field} 
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                  setSelectedProduct(null);
                }}
              >
                취소
              </Button>
              <Button type="submit">추가</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 