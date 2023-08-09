export interface UserType {
  id: number;
  username: string;
  email: string;
  password: string;
  post: PostType[];
  profile: ProfileType;
}

export interface PostType {
  id: number;
  content: string;
  createdAt: string;
  authorID: number;
  author: UserType;
}

export interface ProfileType {
  id: number;
  bio: string;
  profileImageUrl: string;
  userId: number;
  user: UserType;
}
