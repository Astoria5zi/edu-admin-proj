<template>
	<!-- 展示课程列表以及操作 -->
	<div v-if="!isAdd" class="teacher-table">

		<!-- 班级的级联选择器 -->
		<el-select v-model="selectLesson" placeholder="请选择开课班级" clearable>
			<el-option v-for=" item  in  publishCourseArr " :key="item.id" :label="item.name" :value="item.id" />
		</el-select>

		<!-- 课程查询按钮 -->
		<el-button type="primary" @click="btnSelectClass" style="margin: 10px 0px 10px 10px">查询班级详情</el-button>

		<!-- 管理班级教师按钮 -->
		<el-button type="primary" :disabled="!selectLesson" @click="btnAdminClassTeacher"
			style="margin: 10px 0px 10px 10px">管理班级教师</el-button>
		<!-- 班级教师对话框(此处进行班级教师的添加和删除) -->
		<el-dialog v-model="teacherDialogVisible" title="当前课程名称" width="50%" center align-center>
			<el-transfer v-model="currentClassTeacher" :data="data" :titles="['全部教师', '授课教师']" :button-texts="['撤销', '选择']"
				@change="teacherChange" />
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="teacherDialogVisible = false">取消</el-button>
					<el-button type="primary" @click="teacherDialogVisible = false">
						确定
					</el-button>
				</span>
			</template>
		</el-dialog>

		<!-- 课程查询按钮 -->
		<el-button type="primary" @click="btnInquire" style="margin: 10px 0px 10px 10px">管理班级学生</el-button>

		<!-- 展示课程列表 -->
		<el-table :data="coursesArr" border style="width: 100%" max-height="700" stripe>
			<el-table-column label="序号" type="index" algin="center" width="60" align="center"></el-table-column>
			<el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
			<el-table-column prop="name" label="课程名称" width="180" align="center" />
			<el-table-column prop="description" label="课程简介" show-overflow-tooltip align="center" />
			<el-table-column prop="createDate" label="上传时间" width="200" show-overflow-tooltip align="center" />
			<el-table-column prop="users" label="适合人群" width="120" show-overflow-tooltip align="center" />
			<el-table-column prop="auditStatus" label="审核状态" width="100" align="center">
				<template #="{ row }">
					<span v-if="row.auditStatus == 202001">审核未通过</span>
					<span v-else-if="row.auditStatus == 202002">未提交审核</span>
					<span v-else-if="row.auditStatus == 202003">已提交审核</span>
					<span v-else>审核通过</span>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="发布状态" width="100" align="center">
				<template #="{ row }">
					<span v-if="row.status == 203001">未发布</span>
					<span v-else-if="row.status == 203002">已发布</span>
					<span v-else>下线</span>
				</template>
			</el-table-column>
			<el-table-column prop="pic" label="课程封面" width="120" show-overflow-tooltip align="center">
				<template #="{ row }">
					<img v-if="row.pic" class="table-avatar" :src="row.pic" alt="图片地址失效" />
					<span v-else>暂无课程图片</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="120" align="center">
				<!-- 已发布和已审核的不能再提交 -->
				<template #="{ row }">
					<el-popconfirm title="确认提交审核吗?" @confirm="uploadCourse(row.id)">
						<template #reference>
							<el-button :disabled="row.status == 203002 || row.auditStatus == 202003" type="primary" size="small"
								icon="Upload" title="提交审核"></el-button>
						</template>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页器 -->
		<div class="demo-pagination-block" style="margin: 10px 0">
			<el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 40]"
				:background="true" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
				@current-change="handleCurrentChange" />
		</div>
	</div>
</template>
    
<script setup lang="ts">

import { onBeforeMount, onMounted, ref } from "vue";
// 获取课程相关接口
import {
	reqCourseList,
	reqGetTreeNodeCourse,
	reqGetTreeNodeCourseById,
	reqGetCourseBySt,
	reqAddNewCourse,

	reqEditCourse,
	reqUploadCourse,
	reqGetAllPublishCourse
} from "@/api/course";

// 引入教师相关接口
import { reqGetTeacherList,reqAddClassTeacher } from "@/api/teacher";
// 引入班级管理相关接口
import { reqClassTeacher } from '@/api/lesson'

import { ElMessage } from "element-plus";


// 当前页码
let pageNo = ref(1);
// 页码大小
let pageSize = ref(10);
// 课程总数量
let total = ref(0);
// 是否点击添加课程
let isAdd = ref(false);
// 存储课程列表
let coursesArr = ref([]);

// 级联选择器绑定值
let cascaderValue = ref<string[]>([]);
// 已发布课程数组
let publishCourseArr = ref([])

// 选择器绑定的查看班级
let selectLesson = ref()
// 管理班级教师对话框开关
let teacherDialogVisible = ref(false)

// 是否正在按条件查询标志
let isConditonFlag = ref(false)



// #region ================== 班级教师穿梭框选项配置 =================
interface Option {
	key: number
	label: string
	disabled: boolean
}
const data = ref<Option[]>()

// 当前班级负责教师
const currentClassTeacher = ref()
// 所有教师数组
let teachersIdArr = ref([])
// #endregion ======================= end =======================


// 查询班级详情按钮回调
const btnSelectClass = async () => {


}

// 管理班级教师按钮回调
const btnAdminClassTeacher = async () => {
	try {
		let res = await reqClassTeacher(selectLesson.value)
		// 给当前教师数组赋值
		currentClassTeacher.value = res.data.map((item: any) => {
			return item.teacherId
		})
		// 打开管理教师对话框
		teacherDialogVisible.value = true
	} catch (error) {
		console.log(error);
	}
}

// 穿梭框右侧元素改变时的回调
const teacherChange = async () => {
	console.log('当前班主任发生改变');

	
}


// 封装获取课程方法
const getCourses = async () => {
	let result = await reqCourseList(pageNo.value, pageSize.value, {
		auditStatus: "",
		courseName: "",
	});

	coursesArr.value = result.data.items;
	total.value = result.data.counts;
};

// 封装获取所有已发布课程方法
const getAllPublishCourse = async () => {
	// 此处暂时用1000代表获取所有课程信息
	let res = await reqGetAllPublishCourse(1, 1000)
	publishCourseArr.value = res.data.items
}

// 封装所有教师信息方法
const getAllTeacherInfo = async () => {
	let result = await reqGetTeacherList()
	teachersIdArr.value = result.data.items.map((item: any) => ({ id: item.id, name: item.name }));

	// 先把穿梭框data属性配置一下
	data.value = teachersIdArr.value.map((item: any) => {
		return {
			key: item.id,
			label: item.name,
			disabled: false // 设置disabled属性为true
		};
	});
	return teachersIdArr.value; // 返回响应式数据
}

// 组件挂载钩子
onMounted(async () => {
	// 获取课程信息
	await getAllPublishCourse()
	// 获取所有教师信息(用于班级新增教师选择教师)
	await getAllTeacherInfo()

});




// 当前页面改变触发回调
const handleCurrentChange = async () => {
	// 判断当前是否正在按条件查询
	// 如果是，则调用按条件查询课程的接口
	if (isConditonFlag.value) {
		let result = await reqGetCourseBySt(cascaderValue.value.at(-1) as string, pageNo.value, pageSize.value)
		coursesArr.value = result.data.items
	}
	// 否则调用基本获取课程的接口
	else {
		getCourses();
	}
};

// 页面大小改变触发回调
const handleSizeChange = async () => {
	// 判断当前是否正在按条件查询
	// 如果是，则调用按条件查询课程的接口
	if (isConditonFlag.value) {
		let result = await reqGetCourseBySt(cascaderValue.value.at(-1) as string, pageNo.value, pageSize.value)
		coursesArr.value = result.data.items
	}
	// 否则调用基本获取课程的接口
	else {
		getCourses();
	}

};

// 列表页面级联选择器绑定值变化触发回调
const handleChange = async (value: any) => {
	// 如果条件被清空，关闭按条件查询
	if (!value) {
		isConditonFlag.value = false
		pageNo.value = 1
		await getCourses();
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

// 提交按钮回调
const uploadCourse = async (id: number) => {

	let result = await reqUploadCourse(id)
	if (result.code == 200) {
		ElMessage.success("提交审核成功")
		getCourses();
	} else {
		ElMessage.error("提交审核失败")
	}

}







</script>
    
    
    
    
    
    
    
    
    
<style scoped lang="scss">
::v-deep(.el-dialog) {
	display: flex;
	flex-direction: column;
	align-items: center;
}

::v-deep() .el-table {
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
    