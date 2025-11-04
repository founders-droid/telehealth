import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorsService } from '../services/doctors';
import { DoctorProfile } from '../types';

export const useDoctors = (params?: { specialty?: string; search?: string }) => {
  return useQuery({
    queryKey: ['doctors', params],
    queryFn: () => doctorsService.getDoctors(params),
  });
};

export const useDoctor = (id: number) => {
  return useQuery({
    queryKey: ['doctor', id],
    queryFn: () => doctorsService.getDoctorById(id),
    enabled: !!id,
  });
};

export const useDoctorAvailability = (id: number) => {
  return useQuery({
    queryKey: ['doctorAvailability', id],
    queryFn: () => doctorsService.getDoctorAvailability(id),
    enabled: !!id,
  });
};

export const useAvailableSlots = (doctorId: number, date: string) => {
  return useQuery({
    queryKey: ['availableSlots', doctorId, date],
    queryFn: () => doctorsService.getAvailableSlots(doctorId, date),
    enabled: !!doctorId && !!date,
  });
};

export const useSearchDoctors = () => {
  return useMutation({
    mutationFn: (query: string) => doctorsService.searchDoctors(query),
  });
};
