import API from "./auth";

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  created_at: string;
  isFollowing?: boolean;
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
