import { Button, Popover, Card, Form, Row, Col, Select, Input, DatePicker } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import { memo } from 'react';
import { BaseFilterPopoverProps, FilterField } from './filter';

const { RangePicker } = DatePicker;

const renderFilterField = (field: FilterField) => {
  switch (field.type) {
    case 'select':
      return (
        <Select
          showSearch
          allowClear
          placeholder={field.placeholder}
          options={field.options}
          style={{ width: '100%' }}
        />
      );
    case 'input':
      return (
        <Input
          allowClear
          placeholder={field.placeholder}
          style={{ width: '100%' }}
        />
      );
    case 'date':
      return (
        <DatePicker
          placeholder={field.placeholder}
          style={{ width: '100%' }}
        />
      );
    case 'dateRange':
      return (
        <RangePicker
          placeholder={[field.placeholder, field.placeholder]}
          style={{ width: '100%' }}
        />
      );
    default:
      return (
        <Select
          showSearch
          allowClear
          placeholder={field.placeholder}
          options={field.options}
          style={{ width: '100%' }}
        />
      );
  }
};

const FilterPopover = memo(({
  form,
  onFilter,
  onClearFilter,
  filterKey,
  title = "Bộ lọc",
  width = 400,
  placement = "bottomRight",
  buttonText = "Bộ lọc",
  buttonIcon = <UnorderedListOutlined />,
  filterFields
}: BaseFilterPopoverProps) => (
  <Popover
    placement={placement}
    title={title}
    content={
      <Card style={{ width }} key={filterKey}>
        <Form
          layout="horizontal"
          labelAlign="left"
          form={form}
          onFinish={onFilter}
        >
          <Row gutter={16}>
            {filterFields.map((field) => (
              <Col span={24} key={field.name}>
                <Form.Item
                  label={field.label}
                  name={field.name}
                  labelCol={{ span: 6 }}
                >
                  {renderFilterField(field)}
                </Form.Item>
              </Col>
            ))}
          </Row>
          <Row gutter={16} style={{ textAlign: 'center', marginTop: 16 }}>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                  Lọc
                </Button>
                <Button type="default" onClick={onClearFilter}>
                  Xóa bộ lọc
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    }
    trigger="click"
  >
    <Button 
      type="primary" 
      icon={buttonIcon}
      style={{ marginTop: 5 }}
    >
      {buttonText}
    </Button>
  </Popover>
));

export default FilterPopover;