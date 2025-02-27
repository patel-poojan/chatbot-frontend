export interface IBDA {
  category: string;
  subcategories?: {
    subcategory: string;
    questions: string[];
  }[];
}

export interface ISubcategory {
  category: string;
  subcategory: string;
}

export interface IUpdateQuestion {
  category: string;
  subcategory: string;
  questions: string[];
}
