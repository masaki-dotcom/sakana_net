<template>
    <Datepicker :enable-time-picker="false" :day-class="getDayClass" week-start="0"></Datepicker>
</template>

<script setup lang="ts">
    import Datepicker from '@vuepic/vue-datepicker'
    import '@vuepic/vue-datepicker/dist/main.css'

    const getDayClass = (date:Date) => {
      const weekDay = new Date(date).getDay();
      if (weekDay == 6) {
        // 土曜日の場合、classに"saturday"を追加
        return 'saturday';
      }
      if (weekDay == 0) {
        // 日曜日の場合、classに"sunday"を追加
        return 'sunday';
      }
      return '';
    };
    
</script>
<style>
/* scopedの中には書かない */
.saturday {
  color: #0000ff;
}
.sunday {
  color: #ff0000;
}
</style>