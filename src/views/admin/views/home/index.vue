<template>
	<div class="home-container">

		<!-- 顶部信息 -->
		<div class="info-container">
			<!-- 顶部左侧 -->
			<div class="info-left">
				<!-- 管理员信息 -->
				<el-card shadow="hover" :body-style="{ padding: '0px' }" style="height: 40%;">
					<!-- 头像行 -->
					<div class="avatar" style="height: 135px; margin-left: 20px;">
						<el-avatar :icon="UserFilled" style="height: 80px;width: 80px;" :src="userStore.userInfo.userpic" />
						<span style="margin-left: 40px; font-size: 20px;">{{ userStore.userInfo.username }}</span>
						<el-tag class="ml-2" size="large" style="margin-left: 20px;">管理员</el-tag>
					</div>
					<el-divider style="margin: 0;" />

					<!-- 信息行 -->
				</el-card>
				<el-card shadow="hover" :body-style="{ padding: '0px', height: '100%' }" style="height: 55%;">
					<!-- card body -->
					<radius></radius>

				</el-card>

			</div>
			<!-- 顶部右侧 -->
			<div class="info-right">
				<!-- 消息通知栏 -->
				<div class="message">
					<!-- 卡片1 -->
					<el-card shadow="hover" :body-style="{ padding: '0px', height: '100%', display: 'flex' }">
						<div class="icon" style="background-color: rgb(45, 140, 240);">
							<el-icon :size="50" color="#fff">
								<User />
							</el-icon>
						</div>
						<div class="content">
							<h1 style="font-size: 24px;color: rgb(45, 140, 240);font-family: ARIAL;">{{ userCount }}</h1>
							<h2 style="font-size: 14px;color: rgb(180,189,201);margin-top: 5px;">用户数量</h2>
						</div>
					</el-card>
					<!-- 卡片2 -->
					<el-card shadow="hover" :body-style="{ padding: '0px', height: '100%', display: 'flex' }">
						<div class="icon" style="background-color: rgb(100,213,114);">
							<el-icon :size="50" color="#fff">
								<Bell />
							</el-icon>
						</div>
						<div class="content">
							<h1 style="font-size: 24px;color: rgb(45, 140, 240);font-family: ARIAL;">{{ courseCount }}</h1>
							<h2 style="font-size: 14px;color: rgb(180,189,201);margin-top: 5px;">课程数量</h2>
						</div>
					</el-card>
					<!-- 卡片3 -->
					<el-card shadow="hover" :body-style="{ padding: '0px', height: '100%', display: 'flex' }">
						<div class="icon" style="background-color: rgb(242,94,67);">
							<el-icon :size="50" color="#fff">
								<Sell />
							</el-icon>
						</div>
						<div class="content">
							<h1 style="font-size: 24px;color: rgb(45, 140, 240);font-family: ARIAL;">{{ orderCount }}</h1>
							<h2 style="font-size: 14px;color: rgb(180,189,201);margin-top: 5px;">订单数量</h2>
						</div>
					</el-card>
				</div>
				<!-- 待办事项 -->
				<div class="waitlist">

					<el-card shadow="hover" :body-style="{ padding: '0px', height: '100%' }">
						<stackedline></stackedline>
					</el-card>

				</div>
			</div>
		</div>

		<!-- 底部直方图 -->
		<div class="home-footer-container">
			<el-card shadow="hover" :body-style="{ padding: '20px', height: '100%', width: '100%' }">

				<div id="main"></div>
				<!-- card body -->
			</el-card>



			<!-- <div id="main"></div> -->
		</div>
	</div>
</template>

<script setup lang="ts">
// 引入数据统计相关方法
import { reqGetUserCount, reqGetCourseCount, reqGetOrderCount } from '@/api/statistic'
// 引入用户仓库
import useUserStore from '@/store/user';
let userStore = useUserStore()
// 引入饼状图
import radius from './radius.vue'
// 引入折线图
import stackedline from './stackedline.vue'
import * as echarts from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { onMounted, ref } from 'vue';
import { LegendComponent } from 'echarts/components';
import { UserFilled } from '@element-plus/icons-vue'
echarts.use([GridComponent, BarChart, CanvasRenderer, LegendComponent]);

// 展示用户数据
let userCount = ref()
let courseCount = ref()
let orderCount = ref()

// 获取用户|课程|订单数量
const statisticInit = async () => {
	// 用户
	let getUserRes = await reqGetUserCount()
	userCount.value = getUserRes.data
	// 课程
	let getCourseRes = await reqGetCourseCount()
	// 订单
	courseCount.value = getCourseRes.data
	let getOrderRes = await reqGetOrderCount()
	orderCount.value = getOrderRes.data
}

// echarts初始化函数
function init() {
	const chartDom = document.getElementById('main');
	// echartsInstance是echarts.init创建的实例
	const myChart = echarts.init(chartDom);
	// 指定图表的配置项和数据
	const option = {
		title: {
			text: 'ECharts 入门示例'
		},
		tooltip: {},
		legend: {
			data: ['销量']
		},
		xAxis: {
			data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
		},
		yAxis: {},
		series: [
			{
				name: '销量',
				type: 'bar',
				data: [5, 20, 36, 10, 10, 20]
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
onMounted(async () => {
	await statisticInit()
	init()
})
</script>

<style scoped lang="scss">
.home-container {
	height: 100%;
	// width: 100%;
	// background-color: #bfa;
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	.info-container {
		height: 60%;

		display: flex;
		flex-direction: row;
		justify-content: space-between;

		.info-left {
			width: 35%;
			height: 100%;

			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;

			.el-card {
				width: 95%;
			}

			.avatar {
				display: flex;
				align-items: center;

			}

		}

		.info-right {
			height: 100%;
			width: 65%;

			display: flex;
			flex-direction: column;
			justify-content: space-around;

			.message {
				height: 22%;
				width: 100%;
				// background-color: orange;
				display: flex;
				justify-content: space-around;

				.el-card {
					width: 32%;
					border: none;

					.icon {
						display: flex;
						align-items: center;
						justify-content: center;
						height: 100%;
						width: 40%;
					}

					.content {
						height: 100%;
						width: 60%;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
					}
				}
			}

			.waitlist {
				height: 73%;
				width: 100%;


				.el-card {
					margin: 0 auto;
					height: 100%;
					width: 98.5%;



				}
			}
		}

	}

	.home-footer-container {
		height: 40%;
		// background-color: pink;
		display: flex;
		justify-content: space-between;
		// margin: 0 10px;
		margin-left: 13px;
		margin-right: 8px;

		.el-card {
			width: 100%;

			#main {
				width: 50%;
				height: 100%;
			}
		}


	}
}
</style>
