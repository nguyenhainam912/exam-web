import axiosInstance from '@/utils/axiosInstance';

export async function getExams(payload: { page: number; limit: number; cond?: any }) {
  try {
    const { page, limit, cond } = payload;
    const response = await axiosInstance.get('/exams', {
      params: {
        page,
        limit,
        ...(cond && Object.keys(cond).length > 0 && { cond }),
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function postExam(payload: any) {
  return await axiosInstance.post('/exams', payload);
}

export async function putExam(id: string, payload: any) {
  return await axiosInstance.put(`/exams/${id}`, payload);
}

export async function delExam(id: string) {
  return await axiosInstance.delete(`/exams/${id}`);
}

export async function getExamById(id: string) {
  try {
    const response = await axiosInstance.get(`/exams/${id}`);
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function uploadExamFile(file: FormData) {
  try {
    const response = await axiosInstance.post('/exams/upload-file', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export const generateExamWithAI = async (data: {
  subjectId: string;
  gradeLevelId: string;
  examTypeId: string;
  numberOfQuestions: number;
  topics: string;
}) => {
  const response = await axiosInstance.post('/exams/generate-exam', data);
  return response.data;
};

// Lấy danh sách yêu cầu thay đổi đề thi
export async function getExamChangeRequests(payload: { page: number; limit: number; cond?: any }) {
  try {
    const { page, limit, cond } = payload;
    const response = await axiosInstance.get('/exam-change-requests/pageable', {
      params: {
        page,
        limit,
        ...(cond && Object.keys(cond).length > 0 && { cond }),
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
}

// Lấy chi tiết yêu cầu thay đổi đề thi
export async function getExamChangeRequestDetail(id: string) {
  return await axiosInstance.get(`/exam-change-requests/${id}`);
}

// Duyệt hoặc từ chối yêu cầu thay đổi đề thi
export async function reviewExamChangeRequest(id: string, payload: { status: 'APPROVED' | 'REJECTED' }) {
  return await axiosInstance.put(`/exam-change-requests/${id}/review`, payload);
}

// Tạo và download PDF đề thi
export async function generateExamPdf(id: string) {
  try {
    const response = await axiosInstance.post(`/exams/${id}/generate-pdf`, {}, {
      responseType: 'blob', // Important để xử lý file PDF
    });
    return response;
  } catch (error) {
    throw error;
  }
} 