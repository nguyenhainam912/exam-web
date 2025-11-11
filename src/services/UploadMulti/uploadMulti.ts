import axiosInstance from '@/utils/axiosInstance';

// Upload single file to /files with field name "file"
export async function uploadMulti(payload: File | Blob | FormData | undefined) {
  try {
    const form = payload instanceof FormData
      ? payload
      : (() => {
          const f = new FormData();
          if (payload) {
            f.append('file', payload as File | Blob); // single file under 'file'
          }
          return f;
        })();

    const response = await axiosInstance.post(`/files`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
}

// Upload single image to /file/image with field name "file"
export async function uploadMultiPic(payload: File | Blob | FormData | undefined) {
  try {
    const form = payload instanceof FormData
      ? payload
      : (() => {
          const f = new FormData();
          if (payload) {
            f.append('file', payload as File | Blob); // single file under 'file'
          }
          return f;
        })();

    const response = await axiosInstance.post(`/file/image`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
}
