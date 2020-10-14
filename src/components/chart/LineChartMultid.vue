<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <h4 :style="{ marginBottom: '20px' }">{{ title }}</h4>
    <v-chart :force-fit="true" :height="height" :data="data" :scale="scale">
      <v-tooltip/>
      <v-axis/>
      <v-legend/>
      <v-line position="type*y" color="x"/>
      <v-point position="type*y" color="x" :size="4" :v-style="style" :shape="'circle'"/>
    </v-chart>
  </div>
</template>

<script>
  import { DataSet } from '@antv/data-set'

  export default {
    name: 'LineChartMultid',
    props: {
      title: {
        type: String,
        default: ''
      },
      dataSource: {
        type: Array,
        default: () => [
          { type: 'Jan', cmp: 7.0, jeebt: 3.9 },
          { type: 'Feb', cmp: 6.9, jeebt: 4.2 },
          { type: 'Mar', cmp: 9.5, jeebt: 5.7 },
          { type: 'Apr', cmp: 14.5, jeebt: 8.5 },
          { type: 'May', cmp: 18.4, jeebt: 11.9 },
          { type: 'Jun', cmp: 21.5, jeebt: 15.2 },
          { type: 'Jul', cmp: 25.2, jeebt: 17.0 },
          { type: 'Aug', cmp: 26.5, jeebt: 16.6 },
          { type: 'Sep', cmp: 23.3, jeebt: 14.2 },
          { type: 'Oct', cmp: 18.3, jeebt: 10.3 },
          { type: 'Nov', cmp: 13.9, jeebt: 6.6 },
          { type: 'Dec', cmp: 9.6, jeebt: 4.8 }
        ]
      },
      fields: {
        type: Array,
        default: () => ['cmp', 'jeebt']
      },
      height: {
        type: Number,
        default: 254
      }
    },
    data() {
      return {
        scale: [{
          dataKey: 'x',
          min: 0,
          max: 1
        }],
        style: { stroke: '#fff', lineWidth: 1 }
      }
    },
    computed: {
      data() {
        const dv = new DataSet.View().source(this.dataSource)
        dv.transform({
          type: 'fold',
          fields: this.fields,
          key: 'x',
          value: 'y'
        })
        return dv.rows
      }
    }
  }
</script>

<style scoped>

</style>