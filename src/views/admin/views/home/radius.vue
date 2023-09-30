<template>
    <div id="radius"></div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts/core';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { onMounted } from 'vue';

echarts.use([
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout
]);
// echarts初始化函数
function init() {
    const chartDom = document.getElementById('radius');
    // echartsInstance是echarts.init创建的实例
    const myChart = echarts.init(chartDom);
    // 指定图表的配置项和数据
    const option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 1048, name: 'Search Engine' },
                    { value: 735, name: 'Direct' },
                    { value: 580, name: 'Email' },
                    { value: 484, name: 'Union Ads' },
                    { value: 300, name: 'Video Ads' }
                ]
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    // 自适应
    window.addEventListener('resize', function () {
        myChart.resize();
    });
}

// 挂载时渲染表格
onMounted(() => { init() })
</script>


<style scoped lang="scss">
#radius {
    width: 100%;
    height: 100%;
}
</style>
