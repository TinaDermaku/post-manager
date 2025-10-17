import React, { useState } from 'react';
import {
  Row,
  Col,
  Input,
  Select,
  Button,
  Pagination,
  Spin,
  Empty,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PostCard } from '../components/PostCard';
import { usePosts, useDeletePost } from '../hooks/usePosts';
import { PostFilters } from '../types/post';
import '../styles/App.css';

const { Search } = Input;
const { Option } = Select;

export const PostList: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<PostFilters>({
    page: 1,
    pageSize: 6,
    search: '',
    status: 'all',
  });

  const { data, isLoading, error } = usePosts(filters);
  const deletePostMutation = useDeletePost();

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, status: value === 'all' ? undefined : value, page: 1 }));
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    console.log('Page change:', page, pageSize);
    setFilters(prev => ({ 
      ...prev, 
      page, 
      pageSize: pageSize || prev.pageSize 
    }));
  };

  const handleSizeChange = (current: number, size: number) => {
    console.log('Size change:', current, size);
    
    const totalItems = data?.total || 0;
    const newTotalPages = Math.ceil(totalItems / size);
    const newPage = current > newTotalPages ? 1 : current;
    
    setFilters(prev => ({ 
      ...prev, 
      page: newPage, 
      pageSize: size 
    }));
  };

  const handleDelete = (id: string) => {
    deletePostMutation.mutate(id);
  };

  const handleCreate = () => {
    navigate('/posts/create');
  };

  // Debug logs
  console.log('Current filters:', filters);
  console.log('Data:', data);

  if (error) {
    return <div>Error loading posts</div>;
  }

  return (
    <div className="post-list-container">
      <Row gutter={[16, 16]} className="post-list-header">
        <Col xs={24} sm={12} md={8}>
          <Search
            placeholder="Search by title or author"
            allowClear
            onSearch={handleSearch}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Select
            style={{ width: '100%' }}
            value={filters.status || 'all'}
            onChange={handleStatusChange}
          >
            <Option value="all">All Status</Option>
            <Option value="draft">Draft</Option>
            <Option value="published">Published</Option>
            <Option value="archived">Archived</Option>
          </Select>
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            style={{ width: '100%' }}
          >
            New Post
          </Button>
        </Col>
      </Row>

      {isLoading ? (
        <div className="post-list-loading">
          <Spin size="large" />
        </div>
      ) : data?.posts && data.posts.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {data.posts.map(post => (
              <Col xs={24} sm={12} lg={8} key={post.id}>
                <PostCard post={post} onDelete={handleDelete} />
              </Col>
            ))}
          </Row>
          
          <div className="post-list-pagination">
            <Pagination
              current={filters.page}
              pageSize={filters.pageSize}
              total={data.total}
              onChange={handlePageChange}
              onShowSizeChange={handleSizeChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
              pageSizeOptions={['6', '10', '20', '50']}
            />
          </div>
        </>
      ) : (
        <div className="post-list-empty">
          <Empty
            description="No posts found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={handleCreate}>
              Create First Post
            </Button>
          </Empty>
        </div>
      )}
    </div>
  );
};