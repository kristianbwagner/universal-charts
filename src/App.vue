<template>
  <div id="app">
    <Chart
      type="column"
      :config="{
        datasets: [
          {
            name: 'scores',
            axis: 'left',
            color: 'green',
            opacity: 0.2,
            lineWidth: 3,
            circleRadius: 5,
            values: [
              {x: 'A', y: 5},
              {x: 'B', y: 17},
              {x: 'C', y: 24},
              {x: 'D', y: 12},
              {x: 'E', y: 14},
              {x: 'F', y: 6},
              {x: 'G', y: 12},
              {x: 'H', y: 25}
            ]
          }
        ],
        axisBottom: {
          padding: 0.1
        },
        axisLeft: {
          min: 0,
        }
      }"/>
    <Chart type="line"/>
    <Chart type="column"/>
    <Chart type="bar" :config="{
      datasets: [
        {
          name: 'scores',
          axis: 'left',
          color: 'green',
          opacity: 0.2,
          lineWidth: 3,
          circleRadius: 5,
          values: [
            {x: 'A', y: 5},
            {x: 'B', y: 17},
            {x: 'C', y: 24},
            {x: 'D', y: 12},
            {x: 'E', y: 14},
            {x: 'F', y: 6},
            {x: 'G', y: 12},
            {x: 'H', y: 25}
          ]
        },
        {
          name: 'points',
          axis: 'left',
          color: 'blue',
          opacity: 0.2,
          lineWidth: 3,
          circleRadius: 5,
          values: [
            {x: 'A', y: 5},
            {x: 'B', y: 17},
            {x: 'C', y: 24},
            {x: 'D', y: 12},
            {x: 'E', y: 14},
            {x: 'F', y: 6},
            {x: 'G', y: 12},
            {x: 'H', y: 25}
          ]
        }
      ],
      axisBottom: {
        min: 0,
        padding: 0.1
      },
      axisLeft: {
        padding: 0.1
      }
    }"/>
    <Chart type="stackedBar" :config="{
      datasets: [
        {
          name: 'scores',
          axis: 'left',
          color: 'green',
          opacity: 0.2,
          lineWidth: 3,
          circleRadius: 5,
          values: [
            {x: 'A', y: 5},
            {x: 'B', y: 17},
            {x: 'C', y: 24},
            {x: 'D', y: 12},
            {x: 'E', y: 14},
            {x: 'F', y: 6},
            {x: 'G', y: 12},
            {x: 'H', y: 25}
          ]
        },
        {
          name: 'points',
          axis: 'left',
          color: 'blue',
          opacity: 0.2,
          lineWidth: 3,
          circleRadius: 5,
          values: [
            {x: 'A', y: 5},
            {x: 'B', y: 17},
            {x: 'C', y: 24},
            {x: 'D', y: 12},
            {x: 'E', y: 14},
            {x: 'F', y: 6},
            {x: 'G', y: 12},
            {x: 'H', y: 25}
          ]
        }
      ],
      axisBottom: {
        min: 0,
        padding: 0.1
      },
      axisLeft: {
        padding: 0.1
      }
    }"/>
  </div>
</template>

<script>
  import Chart from './components/Chart.vue'

  export default {
    name: 'app',
    components: {
      Chart
    }
  }
</script>

<style>
  
  text {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-size: 13px;
  }

  body {
    margin: 0;
  }

</style>
