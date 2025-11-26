// server/api/fred.ts
import { defineEventHandler, getQuery } from 'h3'
import fetch from 'node-fetch'

const API_KEY = '9d56bbc6692463ab71bc51945c73c0ca'


function getStartDateByRange(range?: string): string {
  const today = new Date()
  switch(range){
    case '1m': today.setMonth(today.getMonth() - 1); break
    case '3m': today.setMonth(today.getMonth() - 3); break
    case '6m': today.setMonth(today.getMonth() - 6); break
    case '1y': today.setFullYear(today.getFullYear() - 1); break
    case '3y': today.setFullYear(today.getFullYear() - 3); break
    case '5y': today.setFullYear(today.getFullYear() - 5); break
    case '10y': today.setFullYear(today.getFullYear() - 10); break
    default: today.setFullYear(today.getFullYear() - 10); break
  }
  return today.toISOString().slice(0,10)
}

interface Observation {
  date: string
  value: number | null
}

async function fetchSeries(seriesId: string, startDate: string): Promise<Observation[]> {
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${API_KEY}&file_type=json&observation_start=${startDate}`
  const res = await fetch(url)
  const data = await res.json()

  if (!data.observations) return []

  return data.observations
    .map((v: any) => ({ date: v.date, value: v.value === '.' ? null : Number(v.value) }))
    .sort((a: Observation, b: Observation) => a.date.localeCompare(b.date))
}

function unifySeries(fx: Observation[], nikkei: Observation[], djia: Observation[]) {
  const latestDate = [fx, nikkei, djia].map(s => s[s.length-1]?.date).sort().reverse()[0]

  const startDate = fx[0].date
  const labels: string[] = []
  const d = new Date(startDate)
  const lastDate = new Date(latestDate)
  while(d <= lastDate){
    labels.push(d.toISOString().slice(0,10))
    d.setDate(d.getDate()+1)
  }

  const fill = (series: Observation[]): (number | null)[] => {
    const map: Record<string, number | null> = {}
    series.forEach(v => map[v.date] = v.value)
    let lastVal: number | null = null
    return labels.map(date => {
      if(map[date] != null){ lastVal = map[date]; return map[date] }
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

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const range = query.range as string | undefined
    const startDate = range ? getStartDateByRange(range) : '2016-01-01'

    const [fx, nikkei, djia] = await Promise.all([
      fetchSeries('DEXJPUS', startDate),
      fetchSeries('NIKKEI225', startDate),
      fetchSeries('DJIA', startDate),
    ])

    const unified = unifySeries(fx, nikkei, djia)

    return {
      labels: unified.labels,
      datasets: [
        { label:'為替（USD/JPY）', data: unified.fx, borderColor:'blue', borderWidth:1, pointRadius:1, pointHoverRadius:3, lineTension:0.2 },
        { label:'日経平均', data: unified.nikkei, borderColor:'rgba(163, 15, 114, 1)', borderWidth:1, pointRadius:1, pointHoverRadius:3, lineTension:0.2 },
        { label:'ダウ平均', data: unified.djia, borderColor:'cornflowerblue', borderWidth:1, pointRadius:1, pointHoverRadius:3, lineTension:0.2 },
      ]
    }
  } catch(err: any) {
    console.error(err)
    return { error: err.message }
  }
})
