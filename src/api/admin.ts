import type { User, PageResult } from '@/types'

// 模拟延迟
const mockDelay = <T>(data: T): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(data), 500))

// 1. 获取用户列表 (分页 + 搜索)
export const getUserList = (params: { page: number; pageSize: number; keyword?: string }) => {
  console.log('Admin searching users:', params)
  const mockUsers: User[] = Array.from({ length: params.pageSize }).map((_, i) => ({
    id: i + 1 + (params.page - 1) * params.pageSize,
    username: `User_${(params.page - 1) * params.pageSize + i + 1}`,
    role: i % 5 === 0 ? 'admin' : 'user', // 每5个有一个管理员
    phone: `138${Math.floor(Math.random() * 100000000).toString().padEnd(8, '0')}`,
    intro: '这是一个普通用户的简介...',
    createTime: '2023-01-15' // 假设有个注册时间字段
  } as any))

  return mockDelay<PageResult<User>>({
    total: 45,
    list: mockUsers,
    page: params.page,
    pageSize: params.pageSize
  })
}

// 2. 获取统计数据 (按月趋势)
// 需求：月累计发布数、月累计响应成功数
export const getMonthlyStats = (params: { start: string; end: string; region?: string }) => {
  console.log('Stats Params:', params)
  // 模拟 6 个月的数据
  const months = ['2023-06', '2023-07', '2023-08', '2023-09', '2023-10', '2023-11']
  const data = months.map(month => ({
    month,
    region: params.region || '全区',
    publishCount: Math.floor(Math.random() * 200 + 50), // 发布数
    successCount: Math.floor(Math.random() * 100 + 20)  // 成功响应数
  }))

  return mockDelay(data)
}