import axiosInstance  from '@/utils/axiosInstance';

/** Lấy danh sách người dùng có phân trang */
export async function getListUser(payload: { page: number; limit: number; cond?: any }) {
  try {
    const { page, limit, cond } = payload;
    const response = await axiosInstance.get('/user', {
      params: {
        page,
        limit,
        ...((Object.keys(cond)?.length > 0 && cond) && {cond: {
          ...cond,
        }})
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
}

/** Lấy thông tin người dùng theo ID */
export async function getUserById(id: string) {
  try {
    const response = await axiosInstance.get(`/user/${id}`);
    return response?.data;
  } catch (error) {
    throw error;
  }
}

/*Update user */
export async function putUser(id: string, payload: any) {
  try {
    const response = await axiosInstance.put(`/users/${id}`, payload);
    return response?.data
  } catch (error) {
    throw error
  }
}

/* REGISTER USER */
export async function postUser(payload: any) {
  try {
    const response = await axiosInstance.post(`/auth/register`, payload);
    return response?.data
  } catch (error) {
    throw error
  }
}
