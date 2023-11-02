<template>
	<!-- 展示课程列表以及操作 -->
	<div v-if="!isAdd" class="class-table">
		<!-- 顶部信息 -->
		<div class="class-table-header">
			<!-- 左侧操作 -->
			<div class="header-left">
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
			</div>

			<!-- 顶部右侧展示信息 -->
			<div class="header-right">
				<!-- 展示课程地点和时间 -->
				<span v-if="classPlace">上课地点：{{ classPlace }}&nbsp;&nbsp;</span>
				<span v-if="classTime">上课时间：{{ classTime }}</span>
			</div>
		</div>

		<!-- 展示课程列表 -->
		<el-table :data="classStudentArr" border style="width: 100%" max-height="700" stripe ref="multipleTableRef"
			@select="handelSelect()" @select-all="handelSelect()">
			<el-table-column type="selection" width="55" />
			<el-table-column label="序号" type="index" algin="center" width="60" align="center"></el-table-column>
			<el-table-column prop="userId" label="ID" width="60" align="center"></el-table-column>
			<el-table-column prop="no" label="学号" width="260" align="center"></el-table-column>
			<el-table-column prop="userName" label="学生名称" width="180" align="center" />
			<el-table-column prop="age" label="年龄" show-overflow-tooltip align="center" />
			<el-table-column prop="cellphone" label="电话" width="200" align="center" />
			<el-table-column prop="score" label="成绩" width="120" align="center">
				<template #="{ row }">
					<el-input v-model="row.score" placeholder="Please input" @change="scoreChange(row.score, row.userId)" />
				</template>
			</el-table-column>
			<el-table-column prop="ispay" label="缴费状态" width="120" align="center">
				<template #="{ row }">
					<el-tag v-if="row.ispay" type="success">已支付</el-tag>
					<el-tag v-else type="danger">未支付</el-tag>
				</template>
			</el-table-column>

		</el-table>

		<el-button @click="removeStudent()" type="danger" :disabled="!selectFlag" size="small"
			style="margin:10px 0 0 5px;">删除</el-button>
		<!-- 分页器 -->
		<div class="demo-pagination-block" style="margin: 10px 0">
			<el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 40]"
				:background="true" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
				@current-change="handleCurrentChange" />
		</div>
	</div>
</template>
    
<script setup lang="ts">

import { onMounted, ref } from "vue";
// 获取课程相关接口
import {
	reqGetCourseBySt,
	reqGetAllPublishCourse
} from "@/api/course";

// 引入教师相关接口
import { reqGetTeacherList } from "@/api/teacher";
// 引入班级管理相关接口
import { reqClassTeacher, reqUpdateClassTeacher, reqGetClassStudent, reqUpdateStudentScore } from '@/api/lesson'

import { ElMessage } from "element-plus";



// 当前页码
let pageNo = ref(1);
// 页码大小
let pageSize = ref(10);
// 课程总数量
let total = ref(0);
// 是否点击添加课程
let isAdd = ref(false);
// 班级学生列表
let classStudentArr = ref([]);
// 上课地点
let classPlace = ref()
// 上课时间
let classTime = ref()

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


// #region ==================表格多选功能区（学生批量删除）===========
// 是否选择了表格的某一行标识
let selectFlag = ref(false)
import { ElTable } from 'element-plus'
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
// 删除学生
const removeStudent = () => {
	let res = multipleTableRef.value!.getSelectionRows()
	console.log(res);
}
// 表格选择行时触发回调
const handelSelect = () => {
	let res = multipleTableRef.value!.getSelectionRows()
	if (res.length) {
		selectFlag.value = true
	} else {
		selectFlag.value = false
	}

}


// #endregion ======================= end =======================



// 查询班级详情按钮回调
const btnSelectClass = async () => {
	getClassStudents()

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
	console.log('当前班主任发生改变', currentClassTeacher.value);
	console.log('所有教师：', teachersIdArr.value);

	// currentClassTeacher.value只有当前班级教师的id，没有匹配的名字
	// 所以此处需要在所有教师数组teachersIdArr中进行查找
	const teachers = currentClassTeacher.value.map((teacherId: number) => {
		const foundTeacher = teachersIdArr.value.find(teacher => teacher.id === teacherId);
		return {
			teacherId: teacherId,
			teacherName: foundTeacher ? foundTeacher.name : "" // 如果找到对应教师名字则返回，否则返回空字符串
		};
	});

	// 整理完毕当前班级教师后，发起更新请求
	try {
		await reqUpdateClassTeacher(selectLesson.value, teachers)
		console.log('更新教师成功');

	} catch (error) {
		console.log(error);
		ElMessage.error('更新班级教师失败')
	}





}


// 封装获取课程方法
const getClassStudents = async () => {
	let result = await reqGetClassStudent(selectLesson.value, pageNo.value, pageSize.value);
	classStudentArr.value = result.data.items;
	total.value = result.data.counts;
	if (total.value) {
		classPlace.value = result.data.items[0].place
		classTime.value = result.data.items[0].classTime
	}

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

// 成绩输入框改变时的回调
const scoreChange = async (score: number, userId: number) => {
	try {
		await reqUpdateStudentScore(selectLesson.value, score, userId)
	} catch (error) {
		console.log(error);
		ElMessage.error("更新成绩失败")

	}

}




// 当前页面改变触发回调
const handleCurrentChange = async () => {
	// 判断当前是否正在按条件查询
	// 如果是，则调用按条件查询课程的接口
	if (isConditonFlag.value) {
		let result = await reqGetCourseBySt(cascaderValue.value.at(-1) as string, pageNo.value, pageSize.value)
		classStudentArr.value = result.data.items
	}
	// 否则调用基本获取课程的接口
	else {
		getClassStudents();
	}
};

// 页面大小改变触发回调
const handleSizeChange = async () => {
	// 判断当前是否正在按条件查询
	// 如果是，则调用按条件查询课程的接口
	if (isConditonFlag.value) {
		let result = await reqGetCourseBySt(cascaderValue.value.at(-1) as string, pageNo.value, pageSize.value)
		classStudentArr.value = result.data.items
	}
	// 否则调用基本获取课程的接口
	else {
		getClassStudents();
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
	classStudentArr.value = result.data.items
}








</script>
    
    
    
    
    
    
    
    
    
<style scoped lang="scss">
.class-table {
	.class-table-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
}

::v-deep(.el-dialog) {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.el-table {
	::v-deep(thead .el-table__cell) {
		background-color: rgb(91, 172, 252);
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
    