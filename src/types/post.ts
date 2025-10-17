export interface IPost {
  id: string;
  title: string;
  body: string;
  author: string;
  status: "draft" | "published" | "archived";
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface PostFilters {
  search?: string;
  status?: string;
  page: number;
  pageSize: number;
}