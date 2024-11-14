export interface IBDA {
  category: string;
  subcategories?: {
    subcategory: string;
    questions: string[];
  }[];
}
