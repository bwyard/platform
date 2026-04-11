// ============================================================
// Block system — pure typed records, registry pattern
// ============================================================

export type BlockType =
  | 'profile'
  | 'about'
  | 'services'
  | 'portfolio'
  | 'testimonials'
  | 'pricing'
  | 'contact'
  | 'faq'
  | 'team'
  | 'gallery'
  | 'cta'
  | 'text'
  | 'video'
  | 'embed';

export interface Block {
  id: string;
  type: BlockType;
  order: number;
  visible: boolean;
  data: Record<string, unknown>;
}

export type BlockRegistry<T extends BlockType = BlockType> = Record<T, unknown>;
