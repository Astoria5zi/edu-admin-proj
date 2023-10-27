<template>
    <div id="radius"></div>
</template>
<script setup lang="ts">
// 引入数据统计相关方法
import { reqGetUserPie } from '@/api/statistic'
import * as echarts from 'echarts/core';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { onMounted, ref } from 'vue';

// 饼状图数据
let usePieData = ref([])


// 数据初始化
const dataInit = async () => {
    let dataRes = await reqGetUserPie()
    // 处理一下响应的数据,替换成echarts需要的样式
    dataRes = dataRes.data.map((item: any) => {
        return {
            name: item.typeName,
            value: item.number
        };
    })
    usePieData.value = dataRes
}


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
                        fontSize: 30,
                        fontWeight: 'bold',
                        // 高亮时标签的文字。
                        formatter: function (param: any) {
                            return `${param.data.name}: ${param.data.value}`;
                        },
                    }
                },
                labelLine: {
                    show: false
                },
                data: usePieData.value
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    // #region ==================== 实现饼图循环高亮功能 ========================
    const selectPie = () => {
        // 高亮效果切换到下一个图形
        let dataLen = option.series[0].data.length;
        currentIndex = (currentIndex + 1) % dataLen;
        highlightPie();
    };
    let currentIndex = -1; // 当前高亮图形在饼图数据中的下标
    let changePieInterval = setInterval(selectPie, 1500); // 设置自动切换高亮图形的定时器
    const highlightPie = () => {
        // 取消所有高亮并高亮当前图形
        // 遍历饼图数据，取消所有图形的高亮效果
        for (let idx in option.series[0].data)
            myChart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: idx,
            });
        // 高亮当前图形
        myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: currentIndex,
        });
    };
    myChart.on('mouseover', (params) => {
        // 用户鼠标悬浮到某一图形时，停止自动切换并高亮鼠标悬浮的图形
        clearInterval(changePieInterval);
        currentIndex = params.dataIndex;
        highlightPie();
    });

    myChart.on('mouseout', () => {
        // 用户鼠标移出时，重新开始自动切换
        if (changePieInterval) clearInterval(changePieInterval);
        changePieInterval = setInterval(selectPie, 1500);
    });

    // #endregion ============================= end ===========================

    // 自适应
    window.addEventListener('resize', function () {
        myChart.resize();
    });
}

// 挂载时渲染表格
onMounted(async () => {
    await dataInit()
    init()
})
</script>


<style scoped lang="scss">
#radius {
    width: 100%;
    height: 100%;
}
</style>
