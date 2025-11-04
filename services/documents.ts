import { apiService, createFormData } from './api';
import { API_ENDPOINTS } from '../config/xano';
import { MedicalDocument, UploadDocumentData } from '../types';

export const documentsService = {
  // Upload medical document
  uploadDocument: async (data: UploadDocumentData): Promise<MedicalDocument> => {
    const formData = createFormData(data);
    return apiService.upload<MedicalDocument>(API_ENDPOINTS.DOCUMENTS.UPLOAD, formData);
  },

  // Get user's documents
  getDocuments: async (): Promise<MedicalDocument[]> => {
    return apiService.get<MedicalDocument[]>(API_ENDPOINTS.DOCUMENTS.LIST);
  },

  // Get patient's documents (for doctors)
  getPatientDocuments: async (patientId: number): Promise<MedicalDocument[]> => {
    return apiService.get<MedicalDocument[]>(
      API_ENDPOINTS.DOCUMENTS.PATIENT_DOCUMENTS(patientId)
    );
  },

  // Delete document
  deleteDocument: async (id: number): Promise<void> => {
    return apiService.delete(API_ENDPOINTS.DOCUMENTS.DELETE(id));
  },
};
