<template>
  <div :id="chartId" :style="{width: '100%', height: '300px'}"></div>
</template>

<script>

import { LineChart, ColumnChart, StackedColumnChart, BarChart, StackedBarChart } from '../charts';

export default {
  props: {
    type: {
      type: String,
      default: 'line'
    },
    config: {
      type: Object,
      default: () => {
        return {
          datasets: [
            {
              name: 'scores',
              axis: 'left',
              type: 'column',
              color: '#056ec9',
              values: [
                {x: 'A', y: 5},
                {x: 'B', y: 17},
                {x: 'C', y: 24},
                {x: 'D', y: 12},
                {x: 'E', y: 4},
                {x: 'F', y: 6},
                {x: 'G', y: 12},
                {x: 'H', y: 25}
              ]
            }
          ],
          axisBottom: {
            padding: 0.1,
          },
          axisLeft: {
            min: 0
          }
        }
      }
    }
  },
  data: () => {
    return {
      chart: {}
    }
  },
  computed: {
    chartId() {
      return `ui-chart-${this._uid}`;
    } 
  },
  methods: {
    initChart() {
      if (this.type === 'line') {
        this.chart = new LineChart(`#${this.chartId}`, this.config);
      } else if (this.type === 'column') {
        this.chart = new ColumnChart(`#${this.chartId}`, this.config);
      } else if (this.type === 'stackedColumn') {
        this.chart = new StackedColumnChart(`#${this.chartId}`, this.config);
      } else if (this.type === 'bar') {
        this.chart = new BarChart(`#${this.chartId}`, this.config);
      } else if (this.type === 'stackedBar') {
        this.chart = new StackedBarChart(`#${this.chartId}`, this.config);
      }
    }
  },
  mounted() {
    this.initChart();
  },
  watch: {
    config() {
      this.chart.update(this.config)
    }, 
    type() {
      this.chart.destroy()
      this.initChart()
    }
  }
  
}
</script>
