import request from '@/utils/request' // 假设你有这个封装，这里主要用 mockDelay 模拟
import type { NeedItem, ResponseItem, ServiceCategory, PageResult } from '@/types'

// 模拟网络延迟
const mockDelay = <T>(data: T, time = 400): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), time))
}

// ==========================================
// 1. 公共/市场 API (所有用户可见)
// ==========================================

// 获取“好服务”大厅列表 (支持筛选、分页)
export const getPublicNeedsList = (params: { page: number; pageSize: number; category?: string; keyword?: string }) => {
  console.log('Query Market:', params)
  return mockDelay({
    total: 45,
    page: params.page,
    list: Array.from({ length: params.pageSize }).map((_, i) => ({
      id: i + 100 + (params.page - 1) * params.pageSize,
      title: `${params.category || '家庭'}服务需求 - ${i}`,
      category: params.category || (i % 2 === 0 ? '保洁服务' : '管道维修'),
      description: '需要专业的服务人员上门，具体情况请看附件图片...',
      region: '北京市朝阳区',
      status: 'Pending', // 市场上的通常是待解决的
      publishTime: '2023-11-20',
      publisherId: 99,
      responseCount: Math.floor(Math.random() * 5), // 模拟已有几人响应
      hasMyResponse: i === 0 // 模拟第一条我已经响应过了
    }))
  })
}

// ==========================================
// 2. “我需要” API (我是发布者)
// ==========================================

// 获取我发布的需求
export const getMyPublishedNeeds = (params: any) => {
  return mockDelay({
    total: 10,
    list: [
      { id: 101, title: '需修水管', category: '管道维修', status: 'Pending', publishTime: '2023-11-21', responseCount: 2 },
      { id: 102, title: '需保洁', category: '保洁服务', status: 'Completed', publishTime: '2023-11-10', responseCount: 1 }
    ]
  })
}

// 获取某个需求的具体响应列表 (用于发布者审核)
export const getResponsesByNeedId = (needId: number) => {
  return mockDelay([
    { 
      id: 201, needId, responderId: 55, responderName: '王师傅', responderIntro: '专业维修20年',
      serviceContent: '我可以自带零件上门维修', price: 150, status: 'Submitted', createTime: '2023-11-22',
      mediaFiles: ['cert.jpg']
    },
    { 
      id: 202, needId, responderId: 66, responderName: '李阿姨', responderIntro: '细心负责',
      serviceContent: '下午三点可到', price: 120, status: 'Rejected', createTime: '2023-11-21',
      mediaFiles: []
    }
  ] as ResponseItem[])
}

// 发布者审核响应 (接受/拒绝)
export const auditResponse = (responseId: number, action: 'accept' | 'reject') => {
  return mockDelay({ code: 200, msg: action === 'accept' ? '已接受' : '已拒绝' })
}

// 发布/修改/删除需求 (Mock)
export const publishNeed = (data: any) => mockDelay({ code: 200, msg: '发布成功' })
export const updateNeed = (data: any) => mockDelay({ code: 200, msg: '修改成功' })
export const deleteNeed = (id: number) => mockDelay({ code: 200, msg: '删除成功' })

// ==========================================
// 3. “我服务” API (我是响应者)
// ==========================================

// 获取“我提交的”响应列表
export const getMyResponses = () => {
  return mockDelay([
    { 
      id: 301, needId: 101, needTitle: '需修水管', serviceContent: '我提供上门服务，包材料', 
      price: 200, status: 'Submitted', createTime: '2023-11-22', mediaFiles: ['tool.jpg']
    },
    { 
      id: 302, needId: 999, needTitle: '老人陪护', serviceContent: '有高级护工证', 
      price: 300, status: 'Accepted', createTime: '2023-11-01', mediaFiles: [] 
    }
  ] as any[]) // 使用 any 规避严格类型检查，实际应为 ResponseItem
}

// 提交新的响应
export const submitResponse = (data: any) => {
  return mockDelay({ code: 200, msg: '响应提交成功' })
}

// 修改我的响应 (仅限未接受状态)
export const updateResponse = (data: any) => {
  return mockDelay({ code: 200, msg: '修改成功' })
}

// 撤销/删除我的响应
export const deleteResponse = (id: number) => {
  return mockDelay({ code: 200, msg: '撤销成功' })
}

// ==========================================
// 4. 通用/系统 API
// ==========================================

// 模拟文件上传
export const uploadFile = (file: File) => {
  // 真实场景: const fd = new FormData(); fd.append('file', file); return request.post('/upload', fd)
  console.log('Uploading file:', file.name)
  return mockDelay({ 
    name: file.name, 
    url: `https://mock-storage.com/${file.name}` 
  }, 1000)
}

// ==========================================
// 5. 管理员 API (为了兼容之前的 AdminStats)
// ==========================================
export const getAdminStats = (params: any) => {
  return mockDelay([
    { category: '保洁服务', publishCount: 120, successCount: 80 },
    { category: '管道维修', publishCount: 60, successCount: 55 },
    { category: '助老服务', publishCount: 200, successCount: 150 },
    { category: '就诊服务', publishCount: 45, successCount: 20 },
  ])
}