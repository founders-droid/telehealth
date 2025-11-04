export type DocumentType = 'lab_result' | 'prescription' | 'scan' | 'other';

export interface MedicalDocument {
  id: number;
  patient_id: number;
  uploaded_by: number;
  document_type: DocumentType;
  file: string;
  description: string;
  uploaded_at: string;
}

export interface UploadDocumentData {
  patient_id: number;
  document_type: DocumentType;
  file: string;
  description: string;
}
