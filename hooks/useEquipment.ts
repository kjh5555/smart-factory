import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { EquipmentResponse } from "@/types/equipment";

export const useEquipment = () => {
  return useQuery<EquipmentResponse>({
    queryKey: ['equipment'],
    queryFn: async () => {
      const { data } = await axios.get('/api/equipment');
      return data;
    }
  });
}; 