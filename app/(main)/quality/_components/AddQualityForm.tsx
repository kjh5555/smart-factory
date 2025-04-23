import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface AddQualityFormProps {
  setOpen: (open: boolean) => void;
}

interface QualityStandard {
  id: string;
  name: string;
  product: {
    name: string;
  };
}

interface QualityCheckResponse {
  id: string;
  standardId: string;
  batchNumber: string;
  inspector: string;
  results: Array<{
    criteriaId: string;
    value: string | number;
    status: "PASS" | "FAIL";
    notes?: string;
  }>;
  notes?: string;
  checkDate: string;
  status: string;
}

const qualityCheckSchema = z.object({
  standardId: z.string({
    required_error: "품질 기준을 선택해주세요.",
  }),
  batchNumber: z.string().min(1, "배치 번호를 입력해주세요."),
  inspector: z.string().min(1, "검사자 이름을 입력해주세요."),
  results: z.array(
    z.object({
      criteriaId: z.string(),
      value: z.union([z.string(), z.number()]),
      status: z.enum(["PASS", "FAIL"]),
      notes: z.string().optional(),
    })
  ),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof qualityCheckSchema>;

export function AddQualityForm({ setOpen }: AddQualityFormProps) {
  const queryClient = useQueryClient();

  // 품질 기준 목록 조회
  const { data: standards } = useQuery<QualityStandard[]>({
    queryKey: ["quality-standards"],
    queryFn: async () => {
      const response = await axios.get("/api/quality-standards");
      return response.data;
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(qualityCheckSchema),
    defaultValues: {
      standardId: '',
      batchNumber: '',
      inspector: '',
      results: [],
      notes: ''
    }
  });

  const { mutate: createQualityCheck, isPending } = useMutation<QualityCheckResponse, Error, FormValues>({
    mutationFn: async (values: FormValues) => {
      const response = await axios.post("/api/quality-checks", values);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quality-checks"] });
      queryClient.invalidateQueries({ queryKey: ["recent-checks"] });
      queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["quality-stats"] });
      queryClient.invalidateQueries({ queryKey: ["quality-trends"] });
      
      form.reset();
      setOpen(false);
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => createQualityCheck(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="standardId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>품질 기준</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="품질 기준을 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {standards?.map((standard: QualityStandard) => (
                    <SelectItem key={standard.id} value={standard.id}>
                      {standard.product.name} - {standard.name}
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
          name="batchNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>배치 번호</FormLabel>
              <FormControl>
                <Input {...field} placeholder="배치 번호를 입력하세요" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inspector"
          render={({ field }) => (
            <FormItem>
              <FormLabel>검사자</FormLabel>
              <FormControl>
                <Input {...field} placeholder="검사자 이름을 입력하세요" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비고</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="추가 설명이 필요한 경우 입력하세요"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? "추가 중..." : "품질 검사 추가"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
} 