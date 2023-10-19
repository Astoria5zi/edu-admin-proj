<template>
	<!-- 展示课程列表以及操作 -->
	<div class="teacher-table">
		<!-- 课程查询按钮 -->
		<el-button type="primary" @click="btnInquire" style="margin: 10px 0px 10px 10px">查询</el-button>

		<!-- 展示课程列表 -->

		<!-- 自定义表头颜色方式1：elment自带的属性，传入配置对象就行 -->
		<!-- <el-table :data="ordersArr" border style="width: 100%" max-height="700"
			:header-cell-style="{ background: '#eef1f6' }"> -->
		<el-table :data="ordersArr" border style="width: 100%" max-height="700" stripe >
			<el-table-column label="序号" type="index" algin="center" width="60" align="center"></el-table-column>
			<el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
			<el-table-column prop="status" label="状态" width="100" align="center">
				<template #="{ row }">
					<span v-if="row.status == 600002">已支付</span>
					<span v-else>未支付</span>
				</template>
			</el-table-column>
			<el-table-column prop="orderType" label="订单类型" width="100" align="center">
				<template #="{ row }">
					<span v-if="row.orderType == 60201">购买课程</span>
					<span v-else>学习资料</span>
				</template>
			</el-table-column>
			<el-table-column prop="userId" label="下单用户ID" width="100" align="center" />
			<el-table-column prop="courseId" label="购买课程ID" width="100" align="center" />
			<el-table-column prop="createDate" label="下单时间" show-overflow-tooltip align="center" />
			<el-table-column prop="payDate" label="支付时间" show-overflow-tooltip align="center" />
			<el-table-column prop="totalPrice" label="订单金额(元)" width="140" align="center" />
			<el-table-column prop="orderDescrip" label="订单备注" width="260" align="center" style="padding: 0;">
				<template #header>
					<div>订单备注</div>
				</template>
			</el-table-column>
			<el-table-column label="修改" width="120" align="center">
				<template #="{ row }">
					<el-button type="primary" size="small" icon="edit" title="修改"
						@click="btnEditHandler(row.courseId, row.userId)"></el-button>
					<el-popconfirm width="220" confirm-button-text="确认" cancel-button-text="取消" :icon="InfoFilled"
						icon-color="#626AEF" title="确定删除此订单吗？" @confirm="btnDeleteHandler(row.id)">
						<template #reference>
							<el-button type="danger" size="small" icon="delete" title="删除"></el-button>
						</template>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>

		<!-- 修改订单对话框 -->
		<el-dialog v-model="isEdit" title="修改订单">
			<el-form :model="orderForm" label-width="120px" :inline="false" style="max-width: 460px">
				<el-form-item label="订单价格：">
					<el-input v-model="orderForm.totalPrice" />
				</el-form-item>
				<el-form-item label="订单备注：">
					<el-input v-model="orderForm.orderDescrip" />
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="confirmEdit">
						确认修改
					</el-button>
					<el-button @click="isEdit = false">取消修改</el-button>
				</span>
			</template>
		</el-dialog>

		<!-- 分页器 -->
		<div class="demo-pagination-block" style="margin: 10px 0">
			<el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 40]"
				:background="true" layout="total, sizes, prev, pager, next, jumper" :total="total"
				@size-change="handleSizeChange" @current-change="handleCurrentChange" />
		</div>

	</div>
</template>
    
<script setup lang="ts">
import { onMounted, ref } from "vue";
// 引入订单接口
import { reqGetOrderList, reqUpdateOrder, reqGetOrderInfoById, reqDeleteOrderById } from '@/api/order'
import { ElMessage } from "element-plus";
import { InfoFilled } from '@element-plus/icons-vue'
// 当前页码
let pageNo = ref(1);
// 页码大小
let pageSize = ref(10);
// 课程总数量
let total = ref(0);
// 是否修改课程
let isEdit = ref(false)
// 存储订单数组
let ordersArr = ref([])
// 是否正在按条件查询标志
let isConditonFlag = ref(false)
// 订单表单对象
let orderForm = ref({
	"courseId": '',
	"createDate": "",
	"orderDescrip": "",
	"orderName": "",
	"orderType": "",
	"payDate": "",
	"status": "",
	"totalPrice": 0,
	"userId": 0,
	"userName": ""
})

// 封装清空表单对象方法
const clearFormObj = () => {
	orderForm.value = {
		"courseId": '',
		"createDate": "",
		"orderDescrip": "",
		"orderName": "",
		"orderType": "",
		"payDate": "",
		"status": "",
		"totalPrice": 0,
		"userId": 0,
		"userName": ""
	}
}


// 封装获取订单方法
const getOrders = async () => {
	let result = await reqGetOrderList(pageNo.value, pageSize.value)
	if (result.code == 200) {
		ordersArr.value = result.data.items
		total.value = result.data.counts;
	} else {
		ElMessage.error("获取订单失败")
	}

}

// 组件挂载时获课程师信息
onMounted(async () => {
	getOrders();

});

// 当前页面改变触发回调
const handleCurrentChange = async () => {
	// 判断当前是否正在按条件查询
	// 如果是，则调用按条件查询课程的接口
	if (isConditonFlag.value) {
		let result = await reqGetCourseBySt(cascaderValue.value.at(-1) as string, pageNo.value, pageSize.value)
		coursesArr.value = result.items
	}
	// 否则调用基本获取课程的接口
	else {
		getOrders();
	}
};

// 页面大小改变触发回调
const handleSizeChange = async () => {
	// 判断当前是否正在按条件查询
	// 如果是，则调用按条件查询课程的接口
	if (isConditonFlag.value) {
		let result = await reqGetCourseBySt(cascaderValue.value.at(-1) as string, pageNo.value, pageSize.value)
		coursesArr.value = result.items
	}
	// 否则调用基本获取课程的接口
	else {
		getOrders();
	}

};

// 点击查询按钮回调
const btnInquire = async () => {
	// 开启按条件查询课程标志
	isConditonFlag.value = true
	// 先获取当前条件下的课程总数
	let result = await reqGetCourseBySt(cascaderValue.value.at(-1) as string)
	total.value = result.data.counts
	// 然后发分页请求
	pageNo.value = 1
	result = await reqGetCourseBySt(cascaderValue.value.at(-1) as string, pageNo.value, pageSize.value)
	coursesArr.value = result.data.items
}

// 点击修改按钮回调
const btnEditHandler = async (courseId: number, userId: number) => {
	let result = await reqGetOrderInfoById(courseId, userId)
	orderForm.value = result.data
	isEdit.value = true
}

// 确认修改
const confirmEdit = async () => {
	let result = await reqUpdateOrder(orderForm.value)
	if (result.code == 200) {
		ElMessage.success("修改订单成功")
		isEdit.value = false
		getOrders()
	} else {
		ElMessage.error("修改订单失败")
	}

}

// 确认删除
const btnDeleteHandler = async (orderId: number) => {
	let result = await reqDeleteOrderById(orderId)
	if (result.code == 200) {
		ElMessage.success("删除成功")
		getOrders()
	} else {
		ElMessage.error("删除失败")
	}
}
</script>
    
    
    
    
    
    
    
    
    
<style scoped lang="scss">
.el-table {
	::v-deep(thead .el-table__cell) {
		background-color: rgb(64, 158, 255);
		color: #eee;
	}
}


.courseinfo {
	position: absolute;
	left: 50%; //起始是在body中，横向距左50%的位置
	top: 50%; //起始是在body中，纵向距上50%的位置，这个点相当于body的中心点，div的左上角的定位
	transform: translate(-50%, -50%); //水平、垂直都居中,也可以写成下面的方式
	width: 100%;
	background-color: rgba($color: #000000, $alpha: 0.3);
	height: 100%;
	z-index: 9;

	.el-card {
		position: relative;
		left: 50%; //起始是在body中，横向距左50%的位置
		top: 50%; //起始是在body中，纵向距上50%的位置，这个点相当于body的中心点，div的左上角的定位
		transform: translate(-50%, -50%); //水平、垂直都居中,也可以写成下面的方式
		width: 60%;
		height: 70%;
	}
}

.avatar-uploader .avatar {
	min-width: 178px;
	height: 178px;
	display: block;
	// background-color: #bcf;
}

.demo-image__error .demonstration {
	display: block;
	color: var(--el-text-color-secondary);
	font-size: 14px;
	margin-bottom: 20px;
}

.demo-image__error .el-image {
	padding: 0 5px;
	max-width: 300px;
	max-height: 200px;
	min-width: 200px;
	width: 100%;
	height: 200px;
}

.demo-image__error .image-slot {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background: var(--el-fill-color-light);
	color: var(--el-text-color-secondary);
	font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
	font-size: 30px;
}

.table-avatar {
	height: 60px;
	width: 100%;
}
</style>
    
<style>
.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
</style>
    