export interface Post {
  id?: string;
  title: string;
  content: string;
  imagePath?: string;
}

export interface PostResponse {
  _id: string;
  title: string;
  content: string;
  imagePath: string;
}
