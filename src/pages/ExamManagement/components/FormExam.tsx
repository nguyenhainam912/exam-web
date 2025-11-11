import { Form, Input, Button, Card, Row, Col, Select, InputNumber, Slider, Radio, Collapse, Upload, Switch, message } from 'antd';
import type { UploadFile } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadMulti } from '@/services/UploadMulti/uploadMulti'; // <-- import service uploadMulti
import { useEffect, useMemo, useCallback } from 'react';
import useExamStore from '@/stores/exam';
import { usePostExamMutation, usePutExamMutation } from '@/hooks/react-query/useExam/useExamMutation';
import rules from '@/utils/rules';
import { useSubjectQuery } from '@/hooks/react-query/useSubject/useSubjectQuery';
import { useGradeLevelQuery } from '@/hooks/react-query/useGradeLevel/useGradeLevelQuery';
import { useExamTypeQuery } from '@/hooks/react-query/useExamType/useExamTypeQuery';
import { MathPreviewInput } from '@/components/MathComponents';

interface FormExamProps {
  examId?: string;
}

interface FormValues {
  title: string;
  description?: string;
  subjectId: string;
  gradeLevelId: string;
  examTypeId: string;
  duration: number;
  questions: QuestionForm[];
}

interface QuestionForm {
  content: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  difficulty?: number;
  isActive?: boolean;
  imageUrls?: string[]; // thêm trường imageUrls
}

const FormExam = ({ examId }: FormExamProps) => {
  const [form] = Form.useForm<FormValues>();
  const {
    view,
    edit,
    record,
    setVisibleForm,
    setEdit,
    setView,
    page,
    limit,
    cond,
  } = useExamStore();

  const mutationCallbacks = useMemo(() => ({
    onSuccess: () => {
      setVisibleForm(false);
      form.resetFields();
    },
    onError: () => {},
    params: { page, limit, cond },
  }), [page, limit, cond, form, setVisibleForm]);

  const { mutate: postExam, isPending: isCreating } = usePostExamMutation({ ...mutationCallbacks });
  const { mutate: putExam, isPending: isUpdating } = usePutExamMutation({
    ...mutationCallbacks,
    onSuccess: () => {
      mutationCallbacks.onSuccess();
      setEdit(false);
      setView(false);
    },
  });

  useEffect(() => {
    if (record?._id && (edit || view)) {
      // Existing record (edit/view mode)
      const formValues: FormValues = {
        title: record.title || '',
        description: record.description || '',
        subjectId: record.subjectId?._id || '',
        gradeLevelId: record.gradeLevelId?._id || '',
        examTypeId: record.examTypeId?._id || '',
        duration: record.duration || 0,
        questions: (record.questions || []).map((q: any) => ({
          content: q.content || '',
          options: q.options && q.options.length >= 4 
            ? q.options.slice(0, 4)
            : ['', '', '', ''],
          correctAnswer:
            Array.isArray(q.correctAnswers) && q.correctAnswers.length > 0
              ? ['A', 'B', 'C', 'D'][q.correctAnswers[0]]
              : undefined,
          explanation: q.explanation || '',
          difficulty: q.difficulty || 1,
          isActive: q.isActive !== false,
          imageUrls: q.metadata?.imageUrls || [], // lấy imageUrls từ metadata nếu có
        })),
      };
      form.setFieldsValue(formValues);
    } else if (record?.questions && !edit && !view) {
      // New exam with uploaded questions
      const formValues: FormValues = {
        title: record.title || '',
        description: record.description || '',
        subjectId: record.subjectId?._id || '',
        gradeLevelId: record.gradeLevelId?._id || '',
        examTypeId: record.examTypeId?._id || '',
        duration: record.duration || 60,
        questions: (record.questions || []).map((q: any) => ({
          content: q.content || '',
          options: q.options && q.options.length >= 4 
            ? q.options.slice(0, 4)
            : ['', '', '', ''],
          correctAnswer: q.correctAnswer || undefined,
          explanation: q.explanation || '',
          difficulty: q.difficulty || 1,
          isActive: q.isActive !== false,
          imageUrls: q.metadata?.imageUrls || [],
        })),
      };
      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
  }, [record, edit, view, form]);

  const handleSubmit = useCallback((values: FormValues) => {
    const questions = (values.questions || []).map(q => {
      const { correctAnswer, imageUrls, ...rest } = q as any;
      let correctIndex = -1;
      if (correctAnswer) {
        correctIndex = ['A', 'B', 'C', 'D'].indexOf(correctAnswer);
      }
      return {
        ...rest,
        // đưa imageUrls vào metadata như bạn yêu cầu
        metadata: { imageUrls: imageUrls || [] },
        correctAnswers: correctIndex !== -1 ? [correctIndex] : [],
      };
    });
    const submitValues = { ...values, questions };
    if (edit && record?._id) {
      putExam({ id: record._id, body: submitValues });
    } else {
      postExam(submitValues);
    }
  }, [edit, record?._id, putExam, postExam]);

  const isLoading = isCreating || isUpdating;
  const isFormDisabled = view;
  const buttonText = edit ? 'Cập nhật' : 'Tạo mới';

  // Lấy danh sách options cho Select
  const { data: subjectList = [], isLoading: loadingSubject } = useSubjectQuery({ page: 1, limit: 100 });
  const { data: gradeLevelList = [], isLoading: loadingGradeLevel } = useGradeLevelQuery({ page: 1, limit: 100 });
  const { data: examTypeList = [], isLoading: loadingExamType } = useExamTypeQuery({ page: 1, limit: 100 });

  const subjectOptions = subjectList.map((item: any) => ({ label: item.name, value: item._id }));
  const gradeLevelOptions = gradeLevelList.map((item: any) => ({ label: item.name, value: item._id }));
  const examTypeOptions = examTypeList.map((item: any) => ({ label: item.name, value: item._id }));

  return (
    <Card>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={isFormDisabled}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tiêu đề đề thi" name="title" rules={rules.required}> 
              <Input placeholder="Nhập tiêu đề đề thi" /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Môn học" name="subjectId" rules={rules.required}> 
              <Select placeholder="Chọn môn học" options={subjectOptions} loading={loadingSubject} /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Khối lớp" name="gradeLevelId" rules={rules.required}> 
              <Select placeholder="Chọn khối lớp" options={gradeLevelOptions} loading={loadingGradeLevel} /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Loại đề" name="examTypeId" rules={rules.required}> 
              <Select placeholder="Chọn loại đề" options={examTypeOptions} loading={loadingExamType} /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Thời lượng (phút)" name="duration" rules={rules.required}> 
              <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập thời lượng" /> 
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Mô tả" name="description"> 
              <MathPreviewInput placeholder="Nhập mô tả (hỗ trợ công thức toán học)" rows={3} disabled={isFormDisabled} /> 
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Số lượng câu hỏi">
              <Input value={record?.questions?.length || 0} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.List name="questions">
              {(fields, { add, remove }) => (
                <>
                  <div style={{ marginBottom: 8, fontWeight: 600 }}>Danh sách câu hỏi</div>
                  <Collapse>
                    {fields.map(({ key, name, ...restField }) => {
                      // helper: tạo fileList từ imageUrls trong form state
                      const getFileList = (): UploadFile<any>[] => {
                        const questions = form.getFieldValue('questions') || [];
                        const maybe = questions?.[name]?.imageUrls;
                        const urls: any[] = Array.isArray(maybe) ? maybe : (maybe ? [maybe] : []);
                        return urls
                          .map((u, idx) => {
                            const url = typeof u === 'string' ? u : (u && (u.url || u.thumbUrl)) || '';
                            if (!url) return null;
                            return {
                              uid: String(idx),
                              name: `image-${idx}`,
                              status: 'done' as UploadFile<any>['status'],
                              url,
                              thumbUrl: url,
                            } as UploadFile<any>;
                          })
                          .filter(Boolean) as UploadFile<any>[];
                      };

                      // upload từng file ngay khi chọn (beforeUpload được gọi cho mỗi file)
                      const handleBeforeUpload = async (file: File) => {
                        const questions = form.getFieldValue('questions') || [];
                        const current = questions?.[name]?.imageUrls;
                        const existingUrls: string[] = Array.isArray(current) ? current.slice() : [];
                        const hideLoading = message.loading({ content: 'Đang tải ảnh...', key: file.name, duration: 0 });
                        try {
                          const resp: any = await uploadMulti(file);
                          hideLoading();

                          // chuẩn hoá response thành mảng url (hỗ trợ nhiều shape)
                          const resolveUrlFromItem = (item: any): string | null => {
                            if (!item) return null;
                            if (typeof item === 'string') return item;
                            // common keys
                            return item.publicUrl || item.url || item.downloadUrl || item.path || item.public_url || null;
                          };

                          let uploadedUrls: string[] = [];
                          if (Array.isArray(resp)) {
                            uploadedUrls = resp.map(resolveUrlFromItem).filter(Boolean) as string[];
                          } else if (resp && typeof resp === 'object') {
                            // resp may be { data: {...} } or {...}
                            if (Array.isArray(resp.data)) {
                              uploadedUrls = resp.data.map(resolveUrlFromItem).filter(Boolean) as string[];
                            } else if (resp.data && typeof resp.data === 'object') {
                              const u = resolveUrlFromItem(resp.data);
                              if (u) uploadedUrls = [u];
                            } else {
                              const u = resolveUrlFromItem(resp);
                              if (u) uploadedUrls = [u];
                            }
                          }

                          const final = [...existingUrls, ...uploadedUrls];
                          questions[name] = { ...questions[name], imageUrls: final };
                          form.setFieldsValue({ questions });

                          if (uploadedUrls.length) {
                            message.success('Tải ảnh lên thành công', 1);
                          } 
                        } catch (err) {
                          hideLoading();
                          // eslint-disable-next-line no-console
                          console.error('Upload file failed', err);
                          message.error('Tải ảnh thất bại. Vui lòng thử lại.');
                        }
                        // return false để ngăn antd thực hiện upload mặc định
                        return false;
                      };

                      return (
                        <Collapse.Panel
                          key={key}
                          header={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div style={{ flex: 1 }}>
                                Câu hỏi {name + 1}
                              </div>
                              {!isFormDisabled && (
                                <Button
                                  type="link"
                                  danger
                                  onClick={e => {
                                    e.stopPropagation();
                                    remove(name);
                                  }}
                                >
                                  Xóa
                                </Button>
                              )}
                            </div>
                          }
                        >
                          <Form.Item
                            label="Nội dung câu hỏi"
                            name={[name, 'content']}
                            rules={rules.required}
                          >
                            <MathPreviewInput
                              placeholder="Nhập nội dung câu hỏi (hỗ trợ công thức toán học)"
                              disabled={isFormDisabled}
                            />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            label={
                              <span>
                                Các lựa chọn (A, B, C, D)
                                <span style={{ color: '#faad14', marginLeft: 16, fontWeight: 500 }}>
                                  Đáp án
                                </span>
                              </span>
                            }
                          >
                            <Form.Item name={[name, 'correctAnswer']} noStyle>
                              <Radio.Group style={{ width: '100%' }} disabled={isFormDisabled}>
                                {['A', 'B', 'C', 'D'].map((option, idx) => (
                                  <div key={option} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: 8 }}>
                                    <div style={{ width: 20, fontWeight: 500 }}>{option}.</div>
                                    <div style={{ flex: 1 }}>
                                      <Form.Item
                                        name={[name, 'options', idx]}
                                        noStyle
                                        rules={[{ required: true, message: `Nhập đáp án ${option}` }]}
                                      >
                                        <MathPreviewInput
                                          placeholder={`Đáp án ${option}`}
                                          rows={1}
                                          disabled={isFormDisabled}
                                        />
                                      </Form.Item>
                                    </div>
                                    <Radio value={option} disabled={isFormDisabled} />
                                  </div>
                                ))}
                              </Radio.Group>
                            </Form.Item>
                          </Form.Item>

                          <Form.Item
                            label="Giải thích (explanation)"
                            name={[name, 'explanation']}
                          >
                            <MathPreviewInput
                              placeholder="Nhập giải thích (hỗ trợ công thức toán học)"
                              rows={2}
                              disabled={isFormDisabled}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Độ khó (1-5)"
                            name={[name, 'difficulty']}
                            rules={rules.required}
                          >
                            <Slider
                              min={1}
                              max={5}
                              marks={{1:'1',2:'2',3:'3',4:'4',5:'5'}}
                              step={1}
                              disabled={isFormDisabled}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Trạng thái"
                            name={[name, 'isActive']}
                            valuePropName="checked"
                          >
                            <Switch
                              checkedChildren="Kích hoạt"
                              unCheckedChildren="Ngừng kích hoạt"
                              disabled={isFormDisabled}
                            />
                          </Form.Item>

                          {/* Remove Form.Item name binding to avoid conflicts with controlled fileList */}
                          <Form.Item label="Hình ảnh">
                            <Upload
                              listType="picture-card"
                              fileList={getFileList()}
                              beforeUpload={handleBeforeUpload}
                              onRemove={async file => {
                                const questions = form.getFieldValue('questions') || [];
                                const current = questions?.[name]?.imageUrls;
                                const existingUrls: string[] = Array.isArray(current) ? current.slice() : [];
                                const fileUrl = (file as any).url || (file as any).thumbUrl || '';
                                const newUrls = existingUrls.filter(u => u !== fileUrl);
                                questions[name] = { ...questions[name], imageUrls: newUrls };
                                form.setFieldsValue({ questions });
                              }}
                              onPreview={(file) => window.open((file as any).url || (file as any).thumbUrl)}
                              accept="image/*"
                              disabled={isFormDisabled}
                            >
                              {!isFormDisabled && (
                                <div>
                                  <PlusOutlined />
                                  <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                                </div>
                              )}
                            </Upload>
                          </Form.Item>
                        </Collapse.Panel>
                      );
                    })}
                  </Collapse>
                  {!isFormDisabled && (
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                        form.setFieldsValue({ questions: [...form.getFieldValue('questions'), {}] });
                      }}
                      style={{ width: '100%', marginTop: 8 }}
                    >
                      <PlusOutlined /> Thêm câu hỏi
                    </Button>
                  )}
                </>
              )}
            </Form.List>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} disabled={isFormDisabled} style={{ width: '100%' }}>
            {buttonText}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormExam;
