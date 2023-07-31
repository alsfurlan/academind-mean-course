export interface Post {
  id?: string;
  title: string;
  content: string;
  image: File;
}

export interface PostResponse {
  _id: string;
  title: string;
  content: string;
  image: File;
}
