import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { PostForm } from '../components/PostForm';
import { useCreatePost } from '../hooks/usePosts';
import { IPost } from '../types/post';
import '../styles/App.css';

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const createPostMutation = useCreatePost();

  const handleSubmit = (values: Omit<IPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    createPostMutation.mutate(values, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

  return (
    <div className="form-container">
      <Space className="form-header">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>
          Back to List
        </Button>
      </Space>

      <Card className="form-card" title="Create New Post">
        <PostForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/')}
          isLoading={createPostMutation.isPending}
        />
      </Card>
    </div>
  );
};