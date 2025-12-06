<template>
  <div class="chart-box">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref } from 'vue'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  TimeScale,
  CategoryScale,
  Legend,
  Filler
} from 'chart.js'
import 'chartjs-adapter-moment'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  TimeScale,
  CategoryScale,
  Legend,
  Filler
)

// Chart.js の TooltipPositionerMap に custom を追加
declare module 'chart.js' {
  interface TooltipPositionerMap {
    custom: (
      elements: any[],
      eventPosition: { x: number; y: number },
      chart: any
    ) => { x: number; y: number }
  }
}

// ▼▼▼ Tooltip をマウスの高さに表示する positioner ▼▼▼
Tooltip.positioners.custom = function (elements, eventPosition) {
  // this を Tooltip 型にキャスト
  const tooltip = this as unknown as import('chart.js').TooltipModel<'line'>

  // chart を安全に取得
  const chart =
    elements.length > 0
      ? elements[0].element.$context.chart
      : tooltip.chart

  if (!chart) {
    return {
      x: 0,
      y: eventPosition.y
    }
  }

  // elements が空 → 左端に合わせる
  if (!elements.length) {
    return {
      x: chart.chartArea.left,
      y: eventPosition.y
    }
  }

  // 通常時（カーソル上のボジション）
  return {
    x: elements[0].element.x,
    y: eventPosition.y
  }
}
// ▲▲▲ ここまで ▲▲▲


// マウスホバー縦線プラグイン
const verticalLinePlugin = {
  id: 'verticalLinePlugin',
  afterDraw(chart: any) {
    if (!chart.tooltip?._active || chart.tooltip._active.length === 0) return
    const ctx = chart.ctx
    const activePoint = chart.tooltip._active[0]
    const x = activePoint.element.x

    ctx.save()
    ctx.beginPath()
    ctx.moveTo(x, chart.chartArea.top)
    ctx.lineTo(x, chart.chartArea.bottom)
    ctx.lineWidth = 1
    ctx.strokeStyle = '#555'
    ctx.stroke()
    ctx.restore()
  }
}

Chart.register(verticalLinePlugin)

export default defineComponent({
  name: 'LineChart',
  props: {
    labels: { type: Array as () => string[], default: () => [] },
    datasets: { type: Array as () => any[], default: () => [] }
  },
  setup(props) {
    const canvas = ref<HTMLCanvasElement>()
    let chart: Chart | null = null

    const renderMyChart = () => {
      if (!canvas.value || !props.labels.length || !props.datasets.length) return
      if (chart) chart.destroy()

      chart = new Chart(canvas.value, {
        type: 'line',
        data: {
          labels: props.labels,
          datasets: props.datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'time',
              time: {
                parser: 'YYYY-MM-DD',
                tooltipFormat: 'YYYY/MM/DD',
                unit: 'year',
                displayFormats: { year: 'YYYY' }
              }
            },
            y: { beginAtZero: false }
          },
          plugins: {
            legend: { display: true, position: 'top' },
            tooltip: {
              mode: 'index',
              intersect: false,
              position: 'custom'  // ← ここがポイント！
            }
          }
        }
      })
    }

    onMounted(() => {
      renderMyChart()
      window.addEventListener('resize', renderMyChart)
    })

    watch([() => props.labels, () => props.datasets], renderMyChart, { deep: true })

    return { canvas }
  }
})
</script>

<style scoped>
.chart-box {
  width: 50%;
  height: 44vh;
}

@media (max-width: 1024px) {
  .chart-box {
    width: 94% !important;
    height: 30vh !important;
  }
}
/* iPad Pro 11インチ横向き対応 */
@media screen and (orientation: landscape) and (max-height: 900px) {
  :deep(.chart-box) {
    width: 94% !important;
    height: 30vh !important;
  }
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
