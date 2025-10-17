import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Space, Spin, Alert } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { PostForm } from '../components/PostForm';
import { usePost, useUpdatePost } from '../hooks/usePosts';
import { IPost } from '../types/post';
import '../styles/App.css';

export const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = usePost(id);
  const updatePostMutation = useUpdatePost();

  const handleSubmit = (values: Omit<IPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (id) {
      updatePostMutation.mutate(
        { id, data: values },
        {
          onSuccess: () => {
            navigate(`/posts/${id}`);
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="post-list-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <Alert
        message="Error"
        description="Post not found or failed to load"
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="form-container">
      <Space className="form-header">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/posts/${id}`)}>
          Back to Post
        </Button>
      </Space>

      <Card className="form-card" title="Edit Post">
        <PostForm
          initialValues={post}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/posts/${id}`)}
          isLoading={updatePostMutation.isPending}
        />
      </Card>
    </div>
  );
};