import { IPost, PostFilters } from '../types/post';

const STORAGE_KEY = 'posts';
const DELAY = 500;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const generateId = (): string => Date.now().toString(36) + Math.random().toString(36).substr(2);

const getStoredPosts = (): IPost[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setStoredPosts = (posts: IPost[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const postsApi = {
  getPosts: async (filters: PostFilters) => {
    await delay(DELAY);
    let posts = getStoredPosts();

    if (filters.search) {
      const searchLower = filters.search.toLowerCase().trim();
      posts = posts.filter(post => {
        const titleWords = post.title.toLowerCase().split(/\s+/);
        const authorWords = post.author.toLowerCase().split(/\s+/);

        const exactTitleMatch = titleWords.some(word => word === searchLower);
        const exactAuthorMatch = authorWords.some(word => word === searchLower);

        return exactTitleMatch || exactAuthorMatch;
      });
    }

    if (filters.status && filters.status !== 'all') {
      posts = posts.filter(post => post.status === filters.status);
    }

    const total = posts.length;
    const start = (filters.page - 1) * filters.pageSize;
    const paginatedPosts = posts.slice(start, start + filters.pageSize);

    return { posts: paginatedPosts, total };
  },

  getPost: async (id: string) => {
    await delay(DELAY);
    const posts = getStoredPosts();
    return posts.find(p => p.id === id) || null;
  },

  createPost: async (postData: Omit<IPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(DELAY);
    const posts = getStoredPosts();
    const newPost: IPost = {
      ...postData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    posts.unshift(newPost);
    setStoredPosts(posts);
    return newPost;
  },

  updatePost: async (id: string, postData: Partial<IPost>) => {
    await delay(DELAY);
    const posts = getStoredPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Post not found');

    const updatedPost: IPost = {
      ...posts[index],
      ...postData,
      updatedAt: new Date().toISOString()
    };
    posts[index] = updatedPost;
    setStoredPosts(posts);
    return updatedPost;
  },

  deletePost: async (id: string) => {
    await delay(DELAY);
    const posts = getStoredPosts();
    const filteredPosts = posts.filter(p => p.id !== id);
    if (filteredPosts.length === posts.length) throw new Error('Post not found');
    setStoredPosts(filteredPosts);
  },
};