import React from 'react';
import { Card, Tag, Space, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, StarFilled } from '@ant-design/icons';
import { IPost } from '../types/post';
import { useNavigate } from 'react-router-dom';

const statusColors = { draft: 'default', published: 'success', archived: 'warning' };

interface PostCardProps {
  post: IPost;
  onDelete: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return (
    <Card
      className="post-card"
      title={
        <div className="post-card-title">
          {post.title.length > 50 ? `${post.title.substring(0, 50)}...` : post.title}
          {post.featured && <StarFilled style={{ color: '#faad14' }} />}
        </div>
      }
      extra={<Tag color={statusColors[post.status]}>{post.status}</Tag>}
      actions={[
        <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/posts/${post.id}`)}>View</Button>,
        <Button type="link" icon={<EditOutlined />} onClick={() => navigate(`/posts/edit/${post.id}`)}>Edit</Button>,
        <Popconfirm title="Delete this post?" onConfirm={() => onDelete(post.id)} okText="Yes" cancelText="No">
          <Button type="link" danger icon={<DeleteOutlined />}>Delete</Button>
        </Popconfirm>,
      ]}
    >
      <div className="post-card-meta">By {post.author}</div>
      <p className="post-card-content">
        {post.body.length > 100 ? `${post.body.substring(0, 100)}...` : post.body}
      </p>
      <div className="post-card-tags space-wrap">
        {post.tags.map(tag => <Tag key={tag} color="blue">{tag}</Tag>)}
      </div>
      <div className="post-card-footer">
        Created: {formatDate(post.createdAt)}
        {post.updatedAt && ` | Updated: ${formatDate(post.updatedAt)}`}
      </div>
    </Card>
  );
};