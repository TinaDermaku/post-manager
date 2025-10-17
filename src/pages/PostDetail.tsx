import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Tag, Space, Button, Spin, Alert } from 'antd';
import { EditOutlined, ArrowLeftOutlined, StarFilled } from '@ant-design/icons';
import { usePost } from '../hooks/usePosts';
import '../styles/App.css';

export const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = usePost(id);

  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString();
  const capitalizeFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

  if (isLoading) return <div className="post-list-loading"><Spin size="large" /></div>;
  if (error || !post) return <Alert message="Error" description="Post not found" type="error" showIcon />;

  return (
    <div className="post-detail-container">
      <Space className="post-detail-header">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>Back to List</Button>
        <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/posts/edit/${post.id}`)}>Edit Post</Button>
      </Space>

      <Card>
        <div className="post-detail-status-tag">
          <Space>
            <Tag color={post.status === 'published' ? 'success' : post.status === 'archived' ? 'warning' : 'default'}>
              {capitalizeFirst(post.status)}
            </Tag>
            {post.featured && <Tag icon={<StarFilled />} color="gold">Featured</Tag>}
          </Space>
        </div>

        <h1 className="post-detail-title">{post.title}{post.featured && <StarFilled style={{ color: '#faad14', marginLeft: 8 }} />}</h1>
        <p className="post-detail-author">By {post.author}</p>
        <div className="post-detail-content">{post.body.split('\n').map((p, i) => <p key={i}>{p}</p>)}</div>
        <div className="post-detail-tags space-wrap">{post.tags.map(tag => <Tag key={tag} color="blue">{tag}</Tag>)}</div>
        <div className="post-detail-meta">
          <div>Created: {formatDateTime(post.createdAt)}</div>
          {post.updatedAt && <div>Updated: {formatDateTime(post.updatedAt)}</div>}
        </div>
      </Card>
    </div>
  );
};