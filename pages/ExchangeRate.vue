<template>
  <div class="pl-8">
    <div class="mt-2 mb-4" v-if="labels.length > 1">
      <strong>{{ lastDateDisplay }}</strong>：
      <span :style="{ color: fxChange >= 0 ? 'blue' : 'red' }">
        JPY ￥{{ lastFx }} ({{ fxChange >= 0 ? '+' : '' }}{{ fxChange }})
      </span>
      <span :style="{ color: djiaChange >= 0 ? 'blue' : 'red', marginLeft: '8px' }">
        ダウ: ${{ lastDjia }} ({{ djiaChange >= 0 ? '+' : '' }}{{ djiaChange }})
      </span>
      <span :style="{ color: nikkeiChange >= 0 ? 'blue' : 'red', marginLeft: '8px' }">
        日経: ￥{{ lastNikkei }} ({{ nikkeiChange >= 0 ? '+' : '' }}{{ nikkeiChange }})
      </span>
    </div>

    <!-- 期間選択ボタン -->
    <div class="mb-4 range-btn-wrapper">
      <button class="range-btn" @click="changeRange('1m')">1ヶ月</button>
      <button class="range-btn" @click="changeRange('3m')">3ヶ月</button>
      <button class="range-btn" @click="changeRange('6m')">6ヶ月</button>
      <button class="range-btn" @click="changeRange('1y')">1年</button>
      <button class="range-btn" @click="changeRange('3y')">3年</button>
      <button class="range-btn" @click="changeRange('5y')">5年</button>
      <button class="range-btn" @click="changeRange('10y')">10年</button>
    </div>

    <div v-if="loading">読み込み中...</div>

    <div v-else>
      <LineChart :labels="labels" :datasets="fxDataset" />
      <LineChart :labels="labels" :datasets="stockDataset" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LineChart from '@/components/LineChart.vue'

interface Dataset {
  label: string
  data: number[]
  borderColor?: string
  borderWidth?: number
  pointRadius?: number
  pointHoverRadius?: number
  lineTension?: number
}

const loading = ref(false)
const labels = ref<string[]>([])
const fxDataset = ref<Dataset[]>([])
const stockDataset = ref<Dataset[]>([])
const range = ref('10y')

// 最後の日の表示用
const lastDateDisplay = ref('')
const lastFx = ref('')
const lastDjia = ref('')
const lastNikkei = ref('')
const fxChange = ref(0)
const djiaChange = ref(0)
const nikkeiChange = ref(0)

const fetchData = async () => {
  loading.value = true
  try {
    // const res = await fetch(`/api/fred?range=${range.value}`)
    const res = await fetch(`https://zgbnpkhciscoxkpqdesn.supabase.co/functions/v1/fred/fred?range=${range.value}`)
    const data = await res.json()

    labels.value = data.labels
    fxDataset.value = data.datasets.filter((ds: Dataset) => ds.label === '為替（USD/JPY）')
    stockDataset.value = data.datasets.filter((ds: Dataset) => ds.label !== '為替（USD/JPY）')

    if (labels.value.length > 1) {
      const lastIndex = labels.value.length - 1
      const prevIndex = lastIndex - 1

      lastDateDisplay.value = labels.value[lastIndex]

      // FX
      const fxLast = fxDataset.value[0]?.data[lastIndex] ?? 0
      const fxPrev = fxDataset.value[0]?.data[prevIndex] ?? 0
      lastFx.value = fxLast.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      fxChange.value = Number((fxLast - fxPrev).toFixed(2))

      // DJIA
      const djiaData = stockDataset.value.find(ds => ds.label === 'ダウ平均')?.data ?? []
      const djiaLastVal = djiaData[lastIndex] ?? 0
      const djiaPrevVal = djiaData[prevIndex] ?? 0
      lastDjia.value = djiaLastVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      djiaChange.value = Number((djiaLastVal - djiaPrevVal).toFixed(2))

      // Nikkei
      const nikkeiData = stockDataset.value.find(ds => ds.label === '日経平均')?.data ?? []
      const nikkeiLastVal = nikkeiData[lastIndex] ?? 0
      const nikkeiPrevVal = nikkeiData[prevIndex] ?? 0
      lastNikkei.value = nikkeiLastVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      nikkeiChange.value = Number((nikkeiLastVal - nikkeiPrevVal).toFixed(2))
    }
  } catch (err) {
    console.error('Fetch error:', err)
  } finally {
    loading.value = false
  }
}

// 期間変更
const changeRange = (r: string) => {
  range.value = r
  fetchData()
}

// 初期ロード
fetchData()
</script>

<style scoped>
.range-btn-wrapper { 
    display: flex;          /* ← 必須！！ */
    max-width: 800px;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin: 0;
    gap: 8px;   /* ★ PC側にも隙間を作る */
}

/* ボタンデザイン（共通） */
.range-btn {
    flex: 1 1 calc(100% / 7 - 8px);
    min-width: 0;
    text-align: center;
    padding: 8px 6px;
    background: #ddd;
    border-radius: 6px;
    white-space: nowrap;
}

/* ---- スマホ（1024px以下）はフルサイズ ---- */
@media (max-width: 1024px) {
  .range-btn-wrapper {
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
    width: 100%;
    justify-content: flex-start;
    padding-right: 8px;
  }

  .range-btn {
    flex: 1 1 0%;
    min-width: 0;
  }
}
</style>
