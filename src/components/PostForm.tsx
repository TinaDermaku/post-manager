import React from 'react';
import { Form, Input, Select, Switch, Button, Space, Tag } from 'antd';
import { IPost } from '../types/post';

const { TextArea } = Input;
const { Option } = Select;
const tagColors: { [key: string]: string } = { tech: 'blue', lifestyle: 'green', business: 'orange', health: 'red' };
const commonTags = ['tech', 'lifestyle', 'business', 'health', 'travel', 'food'];

interface PostFormProps {
  initialValues?: Partial<IPost>;
  onSubmit: (values: Omit<IPost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({ initialValues, onSubmit, onCancel, isLoading = false }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ status: 'draft', featured: false, tags: [], ...initialValues }}
      onFinish={(values) => onSubmit({ ...values, tags: Array.isArray(values.tags) ? values.tags : [] })}
    >
      <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }, { min: 3, message: 'Title must be at least 3 characters' }]}>
        <Input placeholder="Enter post title" />
      </Form.Item>

      <Form.Item name="author" label="Author" rules={[{ required: true, message: 'Please enter author name' }, { min: 2, message: 'Author name must be at least 2 characters' }]}>
        <Input placeholder="Enter author name" />
      </Form.Item>

      <Form.Item name="body" label="Content" rules={[{ required: true, message: 'Please enter post content' }, { min: 10, message: 'Content must be at least 10 characters' }]}>
        <TextArea rows={6} placeholder="Enter post content" />
      </Form.Item>

      <Form.Item name="status" label="Status">
        <Select>
          <Option value="draft">Draft</Option>
          <Option value="published">Published</Option>
          <Option value="archived">Archived</Option>
        </Select>
      </Form.Item>

      <Form.Item name="tags" label="Tags">
        <Select mode="tags" placeholder="Select or create tags">
          {commonTags.map(tag => (
            <Option key={tag} value={tag}><Tag color={tagColors[tag] || 'default'}>{tag}</Tag></Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="featured" label="Featured" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {initialValues?.id ? 'Update Post' : 'Create Post'}
          </Button>
          {onCancel && <Button onClick={onCancel}>Cancel</Button>}
        </Space>
      </Form.Item>
    </Form>
  );
};