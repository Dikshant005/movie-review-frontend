import API from "./auth";

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  created_at: string;
  isFollowing?: boolean;
  followersCount?: number;
  followingCount?: number;
}

export interface UserListProfile {
  id: string;
  username: string;
}

export const getUserProfileApi = async (username: string): Promise<UserProfile> => {
  const response = await API.get<UserProfile>(`/users/profile/${username}`);
  return response.data;
};

export const followUserApi = async (userId: string): Promise<void> => {
  await API.post(`/users/${userId}/follow`);
};

export const unfollowUserApi = async (userId: string): Promise<void> => {
  await API.delete(`/users/${userId}/follow`);
};

export const getFollowersApi = async (username: string): Promise<UserListProfile[]> => {
  const response = await API.get<UserListProfile[]>(`/users/profile/${username}/followers`);
  return response.data;
};

export const getFollowingApi = async (username: string): Promise<UserListProfile[]> => {
  const response = await API.get<UserListProfile[]>(`/users/profile/${username}/following`);
  return response.data;
};
