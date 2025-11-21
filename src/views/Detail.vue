<template>
  <div class="app-container">
    <el-page-header @back="$router.back()" content="详情信息" style="margin-bottom: 20px;" />

    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ type === 'need' ? '需求详情' : '服务响应详情' }} - ID: {{ id }}</span>
          <!-- 需求8: 响应确认按钮 -->
          <el-button v-if="detailData.status !== 'Confirmed'" type="success" @click="handleConfirm">
            确认/响应此服务
          </el-button>
        </div>
      </template>

      <el-descriptions border :column="1">
        <el-descriptions-item label="标题">{{ detailData.title }}</el-descriptions-item>
        <el-descriptions-item label="发布人">User-{{ detailData.userId }}</el-descriptions-item>
        <el-descriptions-item label="发布时间">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="当前状态">
          <el-tag>{{ detailData.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="详细描述">
          {{ detailData.description }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const { type, id } = route.params

const detailData = ref<any>({
  title: '加载中...',
  description: '...',
  status: 'Pending',
  userId: 0,
  createTime: ''
})

onMounted(() => {
  // 模拟根据ID获取详情 API
  setTimeout(() => {
    detailData.value = {
      id: id,
      title: type === 'need' ? '急需家庭保洁' : '承接家庭保洁服务',
      description: '这是一个非常详细的描述文本，说明了具体的需求或服务内容。',
      status: 'Pending', // 待确认
      userId: 88,
      createTime: '2023-11-21 10:00:00'
    }
  }, 300)
})

// 需求8: 确认操作需要有提示框
const handleConfirm = () => {
  ElMessageBox.confirm('确定要响应/确认此条服务信息吗？', '操作确认', {
    confirmButtonText: '立即确认',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    detailData.value.status = 'Confirmed'
    ElMessage.success('操作成功！')
  }).catch(() => {
    // 取消操作
  })
}
</script>