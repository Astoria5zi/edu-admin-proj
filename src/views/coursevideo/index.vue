<template>
	<!-- 顶部导航 -->
	<Header></Header>

	<!--  -->

	<!-- 视频部分 -->
	<div class="video-zone">

		<!-- 视频简介区域 -->
		<div class="video-introduct" v-if="!isPlay">
			<el-container>
				<el-aside>
					<img src="@/static/videos/test.png" alt="">
				</el-aside>
				<el-container>
					<el-header>
						<h1>计算机知识培训</h1>
						<div>
							<span>价格：</span>
							<span style="color: rgb(213,20,35);font-size: 20px;">免费</span>
						</div>

					</el-header>
					<el-divider />
					<el-main>
						<div class="el-main-header">
							<div>
								<span>讲师：</span>
								<span>XXX</span>
							</div>
							<div style="margin-top: 5px;">
								<span>适合人群：</span>
								<span>初学者</span>
							</div>
						</div>
						<div class="el-main-footer">
							<el-button type="primary" size="default" @click="playvideo" style="background-color: rgb(213,20,35);border: none;">播放</el-button>
							<div class="star"><el-icon><Star/></el-icon>收藏</div>
						</div>

					</el-main>
				</el-container>
			</el-container>
		</div>

		<!-- 视频区域 -->
		<div class="videoplay" v-if="isPlay">
			<video id="my-player" class="video-js" controls preload="auto" poster="@/static/videos/test.png" data-setup="{}">
				<source src="@/static/videos/test.mp4" type="video/mp4" />

			</video>
			<!-- "@/static/videos/test.mp4" -->
		</div>
	</div>

	<!-- 视频下方 -->
	<div class="courseinfo-zone">
		<div class="common-layout">
			<el-container class="el-container">
				<el-main class="info-main">
					<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
						<el-tab-pane label="课程介绍" name="first">课程介绍</el-tab-pane>
						<el-tab-pane label="课程目录" name="second">课程目录</el-tab-pane>
						<el-tab-pane label="课程评论" name="third">课程评论</el-tab-pane>
					</el-tabs>
				</el-main>

				<!-- 侧边教师介绍 -->
				<el-aside class="info-aside">
					<el-card class="aside-card" style="height: 100%;">
						<template #header>
							<div class="card-header">
								<span>教师介绍</span>
							</div>
						</template>
						<div class="card-body">
							<span>
								这是教师介绍内容
							</span>
						</div>
					</el-card>
				</el-aside>
			</el-container>
		</div>
	</div>


	<!-- 底部导航 -->
	<Footer></Footer>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
// 是否播放
let isPlay = ref(false)

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event)
}

// 点击播放按钮回调
const playvideo=()=>{
	isPlay.value = true
}





</script>

<style lang="scss" scoped>
.video-zone {
	height: 800px;
	width: 100%;
	background-color: rgb(51, 51, 51);
	display: flex;
	justify-content: center;

	.videoplay {
		width: 80%;
		height: 580px;

		display: flex;
		justify-content: center;

		video {
			width: 100%;
			height: 100%;
		}

	}

	.video-introduct {
		width: 80%;
		height: 500px;
		display: flex;
		justify-content: center;
		// background-color: skyblue;

		.el-container {
			margin-top: 10px;
			height: 100%;

			.el-aside {
				width: 50%;
				height: 100%;
				position: relative;

				img {
					position: absolute;
					top: 30px;
					right: 50px;
					height: 300px;
					// width: 100%;
				}
			}

			.el-container {
				padding: 30px;
				height: 100%;
				color: rgb(87, 102, 102);
				height: 380px;

				.el-header {
					display: flex;
					flex-direction: column;
					justify-content: space-around;

					h1 {
						color: #fff;
						font-size: 24px;
					}
				}

				.el-divider {
					margin: 0;
					margin-top: 15px;
				}

				.el-main {
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.el-main-footer {
						display: flex;
						justify-content: space-between;
						.star{
							cursor: pointer;
							display: flex;
							align-items: center;
						}
					}
				}
			}
		}

	}
}

.courseinfo-zone {

	width: 100%;
	display: flex;
	justify-content: center;
	margin-top: 15px;
	background-color: rgb(246, 248, 251);

	.common-layout {
		height: 300px;
		width: 80%;
		background-color: #fff;

		.el-container {
			height: 100%;

			.info-main {

				// background-color: skyblue;
			}

			.info-aside {
				width: 20%;

			}
		}

	}

}
</style>