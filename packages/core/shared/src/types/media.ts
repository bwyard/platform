// ============================================================
// Media types — files and images stored in object storage
// ============================================================

export type MediaType = 'image' | 'video' | 'document' | 'audio' | 'other';

export interface Media {
  id: string;
  key: string;
  url: string;
  type: MediaType;
  mimeType: string;
  sizeBytes: number;
  altText: string | null;
  uploadedAt: Date;
}
