import { useEffect, useState } from 'react';
import { Row, Col, Card, Spin, message } from 'antd';
import { AreaChart, Area, PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import axiosInstance from '@/utils/axiosInstance';

interface DashboardData {
  totalExams: number;
  examsBySubject: Record<string, number>;
  examsByGradeLevel: Record<string, number>;
  timestamp: string;
}

// Màu hiện đại
const MODERN_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#52C0D8'
];

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [gradeLevelColors, setGradeLevelColors] = useState<string[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Shuffle màu và trả về mảng màu không trùng lặp
  const generateUniqueColors = (count: number) => {
    const shuffled = [...MODERN_COLORS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, MODERN_COLORS.length));
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/dashboard');
      setData(response.data.data);
      
      // Tính toán số lượng items trong mỗi biểu đồ
      const gradeLevelCount = Object.keys(response.data.data.examsByGradeLevel).length;
      
      setGradeLevelColors(generateUniqueColors(gradeLevelCount));
    } catch (error) {
      message.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Chuyển đổi dữ liệu cho biểu đồ miền
  const subjectData = data?.examsBySubject
    ? Object.entries(data.examsBySubject)
        .filter(([_, value]) => (value as number) > 0)
        .map(([name, value]) => ({ name, value }))
    : [];

  const gradeLevelData = data?.examsByGradeLevel
    ? Object.entries(data.examsByGradeLevel).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        {/* Card tổng số đề thi */}
        <Col xs={24} sm={24} md={24}>
          <Card>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
              Tổng số đề thi: {data?.totalExams}
            </div>
          </Card>
        </Col>

        {/* Biểu đồ miền - Đề thi theo môn học */}
        <Col xs={24} sm={24} md={12}>
          <Card title="Đề thi theo môn học">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={subjectData}>
                <defs>
                  <linearGradient id="colorSubject" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => `${value} đề`} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#FF6B6B" 
                  fillOpacity={1} 
                  fill="url(#colorSubject)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Biểu đồ tròn - Đề thi theo khối lớp */}
        <Col xs={24} sm={24} md={12}>
          <Card title="Đề thi theo khối lớp">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={gradeLevelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={120}
                  innerRadius={60}
                  fill="#82ca9d"
                  dataKey="value"
                >
                  {gradeLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={gradeLevelColors[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} đề`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;