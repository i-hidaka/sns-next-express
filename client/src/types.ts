export interface UserType {
  id: number;
  username: string;
  email: string;
  password: string;
  post: PostType[];
}

export interface PostType {
  id: number;
  content: string;
  createdAt: string;
  authorID: number;
  author: UserType;
}
