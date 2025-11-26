<template>
    <div>
      <div id="chart" style="width: 100%; height: 430px;"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  const Plotly: any = require('plotly.js-dist');
  
  // データを取得する関数
  const fetchData = async () => {
    const startDate = '2016-01-01';
    const endDate = new Date().toISOString().split('T')[0];
    
    // APIを用いたデータ取得（仮のURL）
    const response = await fetch(`https://api.example.com/data?start=${startDate}&end=${endDate}`);
    const data = await response.json();
    return data;
  };
  
  // グラフを描画する関数
  const plotData = (data: any) => {
    const trace1 = {
      x: data.dates,
      y: data.nikkei225,
      mode: 'lines',
      name: '日経平均',
      line: { color: '#1f77b4' }
    };
  
    const trace2 = {
      x: data.dates,
      y: data.djia,
      mode: 'lines',
      name: 'ダウ平均',
      line: { color: '#ff7f0e' }
    };
  
    const trace3 = {
      x: data.dates,
      y: data.dexjpus,
      mode: 'lines',
      name: `為替 - 予算 ￥${data.budgetRate}`,
      line: { color: '#0000FF' }
    };
  
    const layout = {
      title: '経済指標',
      xaxis: { title: '日付' },
      yaxis: { title: '値' },
      legend: { x: 0, y: 1 }
    };
  
    Plotly.newPlot('chart', [trace1, trace2, trace3], layout);
  };
  
  // メイン関数
  const main = async () => {
    const data = await fetchData();
    
    // データ加工
    const processedData = {
      dates: data.dates,
      nikkei225: data.nikkei225,
      djia: data.djia,
      dexjpus: data.dexjpus,
      budgetRate: 128.11 // 予算レートの設定
    };
  
    plotData(processedData);
  };
  
  // コンポーネントがマウントされた後にデータを取得してグラフを描画
  onMounted(() => {
    main();
  });
  </script>
  