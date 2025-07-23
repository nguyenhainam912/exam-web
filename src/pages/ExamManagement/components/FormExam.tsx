import { Form, Input, Button, Card, Row, Col, Select, InputNumber, Slider, Radio, Collapse } from 'antd';
import { useEffect, useMemo, useCallback } from 'react';
import useExamStore from '@/stores/exam';
import { usePostExamMutation, usePutExamMutation } from '@/hooks/react-query/useExam/useExamMutation';
import rules from '@/utils/rules';
import { useSubjectQuery } from '@/hooks/react-query/useSubject/useSubjectQuery';
import { useGradeLevelQuery } from '@/hooks/react-query/useGradeLevel/useGradeLevelQuery';
import { useExamTypeQuery } from '@/hooks/react-query/useExamType/useExamTypeQuery';
import { useExamByIdQuery } from '@/hooks/react-query/useExam/useExamQuery';

// TODO: Replace with real options from API or constants
const statusOptions = [
  { label: 'Nháp', value: 'DRAFT' },
  { label: 'Công khai', value: 'PUBLISHED' },
  { label: 'Ẩn', value: 'HIDDEN' },
];

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
      const formValues: FormValues = {
        title: record.title || '',
        description: record.description || '',
        subjectId: record.subjectId?._id || '',
        gradeLevelId: record.gradeLevelId?._id || '',
        examTypeId: record.examTypeId?._id || '',
        duration: record.duration || 0,
        questions: record.questions || [],
      };
      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
  }, [record, edit, view, form]);

  const handleSubmit = useCallback((values: FormValues) => {
    // Convert correctAnswer (string) to correctAnswers (array of index) for each question
    const questions = (values.questions || []).map(q => {
      const { correctAnswer, ...rest } = q;
      let correctIndex = -1;
      if (correctAnswer) {
        // 'A' -> 0, 'B' -> 1, 'C' -> 2, 'D' -> 3
        correctIndex = ['A', 'B', 'C', 'D'].indexOf(correctAnswer);
      }
      return {
        ...rest,
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
            <Form.Item 
              label="Tiêu đề đề thi" 
              name="title" 
              rules={rules.required}
            > 
              <Input placeholder="Nhập tiêu đề đề thi" /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Môn học" 
              name="subjectId"
              rules={rules.required}
            > 
              <Select placeholder="Chọn môn học" options={subjectOptions} loading={loadingSubject} /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Khối lớp" 
              name="gradeLevelId"
              rules={rules.required}
            > 
              <Select placeholder="Chọn khối lớp" options={gradeLevelOptions} loading={loadingGradeLevel} /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Loại đề" 
              name="examTypeId"
              rules={rules.required}
            > 
              <Select placeholder="Chọn loại đề" options={examTypeOptions} loading={loadingExamType} /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Thời lượng (phút)" 
              name="duration"
              rules={rules.required}
            > 
              <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập thời lượng" /> 
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item 
              label="Mô tả" 
              name="description"
            > 
              <Input.TextArea placeholder="Nhập mô tả" rows={3} /> 
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Số lượng câu hỏi">
              <Input value={record?.questions?.length || 0} disabled />
            </Form.Item>
          </Col>
          {/* Thêm phần tạo/chỉnh sửa câu hỏi */}
          <Col span={24}>
            <Form.List name="questions">
              {(fields, { add, remove }) => (
                <>
                  <div style={{ marginBottom: 8, fontWeight: 600 }}>Danh sách câu hỏi</div>
                  <Collapse accordion>
                    {fields.map(({ key, name, ...restField }) => (
                      <Collapse.Panel
                        key={key}
                        header={`Câu hỏi ${name + 1}`}
                        extra={
                          !isFormDisabled && (
                            <Button danger onClick={e => { e.stopPropagation(); remove(name); }} size="small">Xóa</Button>
                          )
                        }
                      >
                        <Card type="inner" bordered={false} style={{ margin: 0, padding: 0, boxShadow: 'none' }}>
                          <Form.Item
                            {...restField}
                            label="Nội dung câu hỏi"
                            name={[name, 'content']}
                            rules={rules.required}
                          >
                            <Input.TextArea placeholder="Nhập nội dung câu hỏi" rows={2} disabled={isFormDisabled} />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            label={
                              <span>
                                Các lựa chọn (A, B, C, D)
                                <span style={{ color: '#faad14', marginLeft: 16, fontWeight: 500 }}>
                                  Đáp án đúng
                                </span>
                              </span>
                            }
                            required
                          >
                            <Form.Item
                              name={[name, 'correctAnswer']}
                              noStyle
                              rules={[{ required: true, message: 'Chọn đáp án đúng' }]}
                            >
                              <Radio.Group style={{ width: '100%' }} disabled={isFormDisabled}>
                                {['A', 'B', 'C', 'D'].map((option, idx) => (
                                  <Input.Group compact key={option} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                    <Form.Item
                                      name={[name, 'options', idx]}
                                      noStyle
                                      rules={[{ required: true, message: `Nhập đáp án ${option}` }]}
                                    >
                                      <Input style={{ width: '85%' }} placeholder={`Đáp án ${option}`} disabled={isFormDisabled} />
                                    </Form.Item>
                                    <Radio value={option} style={{ marginLeft: 8 }} disabled={isFormDisabled} />
                                  </Input.Group>
                                ))}
                              </Radio.Group>
                            </Form.Item>
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            label="Giải thích (explanation)"
                            name={[name, 'explanation']}
                          >
                            <Input.TextArea placeholder="Nhập giải thích (nếu có)" rows={2} disabled={isFormDisabled} />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            label="Độ khó (1-5)"
                            name={[name, 'difficulty']}
                          >
                            <Slider min={1} max={5} marks={{1:'1',2:'2',3:'3',4:'4',5:'5'}} step={1} disabled={isFormDisabled} style={{ width: '100%' }} />
                          </Form.Item>
                        </Card>
                      </Collapse.Panel>
                    ))}
                  </Collapse>
                  {!isFormDisabled && (
                    <Button type="dashed" onClick={() => add()} block style={{ marginTop: 8 }}>
                      Thêm câu hỏi
                    </Button>
                  )}
                </>
              )}
            </Form.List>
          </Col>
        </Row>
        {!view && (
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isLoading}
              size="large"
            >
              {buttonText}
            </Button>
          </Form.Item>
        )}
      </Form>
    </Card>
  );
};

export default FormExam; 