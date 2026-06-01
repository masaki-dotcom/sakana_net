// server/api/index.ts

const API_KEY = "9d56bbc6692463ab71bc51945c73c0ca"

// ======================
// キャッシュ
// ======================
interface CacheData {
  data: Observation[]
  timestamp: number
}

const cache = new Map<string, CacheData>()

// 1時間
const CACHE_TIME = 1000 * 60 * 60

// ======================
// 型
// ======================
interface Observation {
  date: string
  value: number | null
}

// ======================
// 期間計算
// ======================
function getStartDateByRange(range?: string): string {

  const today = new Date()

  switch (range) {

    case "1m":
      today.setMonth(today.getMonth() - 1)
      break

    case "3m":
      today.setMonth(today.getMonth() - 3)
      break

    case "6m":
      today.setMonth(today.getMonth() - 6)
      break

    case "1y":
      today.setFullYear(today.getFullYear() - 1)
      break

    case "3y":
      today.setFullYear(today.getFullYear() - 3)
      break

    case "5y":
      today.setFullYear(today.getFullYear() - 5)
      break

    case "10y":
      today.setFullYear(today.getFullYear() - 10)
      break

    default:
      today.setFullYear(today.getFullYear() - 10)
  }

  return today.toISOString().slice(0, 10)
}

// ======================
// FRED取得
// ======================
async function fetchSeries(
  seriesId: string,
  startDate: string
): Promise<Observation[]> {

  const cacheKey = `${seriesId}_${startDate}`

  const cached = cache.get(cacheKey)

  // キャッシュ使用
  if (
    cached &&
    Date.now() - cached.timestamp < CACHE_TIME
  ) {

    console.log(`Cache Hit: ${cacheKey}`)

    return cached.data
  }

  try {

    const url =
      `https://api.stlouisfed.org/fred/series/observations` +
      `?series_id=${seriesId}` +
      `&api_key=${API_KEY}` +
      `&file_type=json` +
      `&observation_start=${startDate}`

    console.log(`Fetch FRED: ${seriesId}`)

    const data: any = await $fetch(url)

    if (!data.observations) {

      console.error(`No observations: ${seriesId}`)

      return []
    }

    const result = data.observations
      .map((v: any) => {

        if (v.value === ".") {
          return {
            date: v.date,
            value: null
          }
        }

        let value = Number(v.value)

        // DEXJPUSはJPY/USDなのでUSD/JPYへ変換
        if (seriesId === "DEXJPUS") {

          if (value !== 0) {
            const value = Number(v.value)
          }
        }
        
        return {
          date: v.date,
          value
        }
        
      })
      .sort((a, b) => a.date.localeCompare(b.date))

    // キャッシュ保存
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    })

    return result

  } catch (err) {

    console.error(`FRED Error: ${seriesId}`, err)

    // API失敗時はキャッシュを返す
    if (cached) {

      console.log(`Use Cache: ${cacheKey}`)

      return cached.data
    }

    return []
  }
}

// ======================
// データ整列
// ======================
function unifySeries(
  fx: Observation[],
  nikkei: Observation[],
  djia: Observation[]
) {

  const latestDate = [fx, nikkei, djia]
    .map(s => s[s.length - 1]?.date)
    .filter(Boolean)
    .sort()
    .reverse()[0]

  const startDate = fx[0]?.date

  if (!startDate || !latestDate) {

    return {
      labels: [],
      fx: [],
      nikkei: [],
      djia: []
    }
  }

  const labels: string[] = []

  const d = new Date(startDate)
  const lastDate = new Date(latestDate)

  while (d <= lastDate) {

    labels.push(d.toISOString().slice(0, 10))

    d.setDate(d.getDate() + 1)
  }

  const fill = (
    series: Observation[]
  ): (number | null)[] => {

    const map: Record<string, number | null> = {}

    series.forEach(v => {
      map[v.date] = v.value
    })

    let lastVal: number | null = null

    return labels.map(date => {

      if (map[date] != null) {

        lastVal = map[date]

        return map[date]
      }

      return lastVal
    })
  }

  return {
    labels,
    fx: fill(fx),
    nikkei: fill(nikkei),
    djia: fill(djia)
  }
}

// ======================
// API本体
// ======================
export default defineEventHandler(async (event) => {

  try {

    const query = getQuery(event)

    const range = (query.range as string) || "10y"

    const startDate = getStartDateByRange(range)

    const fx = await fetchSeries(
        "DEXJPUS",
        startDate
      )
      await new Promise(resolve =>
        setTimeout(resolve, 1000)
      )
      const nikkei = await fetchSeries(
        "NIKKEI225",
        startDate
      )
      await new Promise(resolve =>
        setTimeout(resolve, 1000)
      )
      const djia = await fetchSeries(
        "DJIA",
        startDate
      )
    const unified = unifySeries(
      fx,
      nikkei,
      djia
    )

    return {
      labels: unified.labels,
      datasets: [
        {
          label: "為替（USD/JPY）",
          data: unified.fx,
          borderColor: "blue",
          borderWidth: 1,
          pointRadius: 1,
          pointHoverRadius: 3,
          tension: 0.2
        },
        {
          label: "日経平均",
          data: unified.nikkei,
          borderColor: "rgba(163,15,114,1)",
          borderWidth: 1,
          pointRadius: 1,
          pointHoverRadius: 3,
          tension: 0.2
        },
        {
          label: "ダウ平均",
          data: unified.djia,
          borderColor: "cornflowerblue",
          borderWidth: 1,
          pointRadius: 1,
          pointHoverRadius: 3,
          tension: 0.2
        }
      ]
    }

  } catch (err) {

    console.error(err)

    return {
      labels: [],
      datasets: [],
      error: String(err)
    }
  }
})