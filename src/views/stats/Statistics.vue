<template>
  <div class="app-container">
    <el-card>
      <!-- 筛选栏 -->
      <div class="filter-container">
        <el-date-picker
          v-model="query.dateRange"
          type="monthrange"
          range-separator="至"
          start-placeholder="起始年月"
          end-placeholder="终止年月"
          value-format="YYYY-MM"
          style="margin-right: 10px"
        />
        <el-input v-model="query.region" placeholder="地域 (如: 北京)" style="width: 150px; margin-right: 10px" />
        <el-button type="primary" @click="fetchStats">分析</el-button>
      </div>

      <!-- 两个视图切换 -->
      <el-tabs v-model="activeView" style="margin-top: 20px">
        <!-- 1. 趋势图 -->
        <el-tab-pane label="趋势分析 (图表)" name="chart">
          <div ref="chartRef" style="width: 100%; height: 400px;"></div>
        </el-tab-pane>
        
        <!-- 2. 明细列表 -->
        <el-tab-pane label="统计明细 (列表)" name="list">
          <el-table :data="statsData" border stripe>
            <el-table-column prop="month" label="月份" sortable />
            <el-table-column prop="region" label="地域" />
            <el-table-column prop="publishCount" label="月累计发布需求数" sortable />
            <el-table-column prop="successCount" label="月累计响应成功数" sortable />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

const activeView = ref('chart')
const chartRef = ref<HTMLElement>()
const statsData = ref<any[]>([])
let myChart: echarts.ECharts | null = null

// 默认近6个月
const end = dayjs().format('YYYY-MM')
const start = dayjs().subtract(5, 'month').format('YYYY-MM')

const query = reactive({
  dateRange: [start, end],
  region: ''
})

// 模拟 API 请求
const fetchStats = async () => {
  // 实际请求: const res = await api.getStats({ start: query.dateRange[0], ... })
  
  // Mock 生成数据
  const mock = []
  let curr = dayjs(query.dateRange?.[0] || start)
  const stop = dayjs(query.dateRange?.[1] || end)
  
  while (curr.isBefore(stop) || curr.isSame(stop, 'month')) {
    mock.push({
      month: curr.format('YYYY-MM'),
      region: query.region || '全区',
      publishCount: Math.floor(Math.random() * 200 + 50),
      successCount: Math.floor(Math.random() * 100 + 20)
    })
    curr = curr.add(1, 'month')
  }
  
  statsData.value = mock
  renderChart()
}

const renderChart = () => {
  if (activeView.value !== 'chart') return
  nextTick(() => {
    if (!chartRef.value) return
    if (!myChart) myChart = echarts.init(chartRef.value)
    
    myChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['发布需求数', '响应成功数'] },
      xAxis: { type: 'category', data: statsData.value.map(i => i.month) },
      yAxis: { type: 'value' },
      series: [
        { name: '发布需求数', type: 'bar', data: statsData.value.map(i => i.publishCount) },
        { name: '响应成功数', type: 'line', data: statsData.value.map(i => i.successCount) }
      ]
    })
    myChart.resize()
  })
}

// 监听 Tab 切换，重新渲染图表
watch(activeView, () => {
  if (activeView.value === 'chart') renderChart()
})

onMounted(fetchStats)
</script>