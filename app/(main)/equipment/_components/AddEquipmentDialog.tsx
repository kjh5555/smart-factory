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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { EquipmentType, LocationType } from "@/types/equipment";

// 설비 추가 폼 스키마
const equipmentSchema = z.object({
  name: z.string().min(1, "설비명을 입력해주세요"),
  typeId: z.string().min(1, "설비 유형을 선택해주세요"),
  locationId: z.string().min(1, "설비 위치를 선택해주세요"),
  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE", "REPAIR"]),
  lastMaintenance: z.string().min(1, "마지막 점검일을 입력해주세요"),
  nextMaintenance: z.string().min(1, "다음 점검일을 입력해주세요"),
});

type FormValues = z.infer<typeof equipmentSchema>;

export default function AddEquipmentDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // 설비 유형 목록 조회
  const { data: equipmentTypes } = useQuery<EquipmentType[]>({
    queryKey: ['equipment-types'],
    queryFn: async () => {
      const { data } = await axios.get('/api/equipment-types');
      return data;
    }
  });

  // 위치 목록 조회
  const { data: locations } = useQuery<LocationType[]>({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data } = await axios.get('/api/locations');
      return data;
    }
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: "",
      typeId: "",
      locationId: "",
      status: "ACTIVE",
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: new Date().toISOString().split('T')[0],
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      // 서버로 전송할 때 operationStatus를 추가
      return axios.post('/api/equipment', {
        ...values,
        operationStatus: "STANDBY"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      setOpen(false);
      form.reset();
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          설비 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>설비 추가</DialogTitle>
          <DialogDescription>
            새로운 설비의 정보를 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설비명</FormLabel>
                  <FormControl>
                    <Input placeholder="프레스 기계 A-1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설비 유형</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="설비 유형을 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {equipmentTypes?.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
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
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설비 위치</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="설비 위치를 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations?.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
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
              name="lastMaintenance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>마지막 점검일</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nextMaintenance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>다음 점검일</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              설비 추가
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 