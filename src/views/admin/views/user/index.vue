<template>
	<!-- 展示用户列表以及操作 -->
	<div v-if="!isAdd" class="User-table">
		<!-- 搜索框 -->
		<el-input placeholder="输入用户姓名" clearable @clear="handleClear" :suffix-icon="Search" style="width: 200px ;"
			v-model="keyWords" />
		<!-- 课程查询按钮 -->
		<el-button type="primary" @click="btnInquire" style="margin: 10px 0px 10px 10px">查询</el-button>
		<!-- 添加用户按钮 -->
		<el-button type="primary" size="default" @click="addUserBtn" style="margin: 10px;">添加用户</el-button>
		<!-- 展示用户列表 -->
		<el-table :data="usersArr" border style="width: 100%" max-height="75vh " :show-overflow-tooltip="true">
			<el-table-column label="序号" type="index" algin="center" width="80" align="center"></el-table-column>
			<el-table-column prop="id" label="编号" width="80" align="center" />
			<el-table-column prop="name" label="姓名" width="150" align="center" />
			<el-table-column prop="username" label="用户名" width="150" align="center" />
			<el-table-column prop="sex" label="用户性别" width="100" align="center">
				<template #="{ row }">
					<span v-if="row.sex == 1">男</span>
					<span v-else>女</span>
				</template>
			</el-table-column>
			<el-table-column prop="utype" label="用户类型" width="150" align="center">
				<template #="{ row }">
					<span v-if="row.utype == 101003">管理员</span>
					<span v-else-if="row.utype == 101002">老师</span>
					<span v-else>学生</span>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="用户状态" width="100" align="center" />
			<el-table-column prop="createTime" label="注册时间" align="center" />
			<el-table-column prop="pic" label="用户照片" width="150" align="center">
				<template #="{ row }">
					<img class="table-avatar" :src="row.userpic" alt="">
				</template>
			</el-table-column>
			<el-table-column label="操作" width="220" align="center">
				<template #="{ row }">
					<el-button type="primary" size="small" @click="editUser(row.id)" icon="Edit" title="修改用户"></el-button>
					<el-button type="primary" size="small" @click="searchUser(row.id)" icon="Search"
						title="查看用户详情"></el-button>
					<el-popconfirm title="确认删除吗?" @confirm="removeUser(row.id)">
						<template #reference>
							<el-button type="danger" size="small" icon="Delete" title="删除用户"></el-button>
						</template>
					</el-popconfirm>
					<el-button v-if="row.status == 1" type="info" size="small" @click="changeUserStatus(row.id, '0')"
						icon="TurnOff" title="禁用用户"></el-button>
					<el-button v-else type="success" size="small" @click="changeUserStatus(row.id, '1')" icon="Open"
						title="启用用户"></el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页器 -->
		<div class="demo-pagination-block" style="margin: 10px 0;">
			<el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 40]"
				:background="true" layout="total, sizes, prev, pager, next, jumper" :total="total"
				@size-change="handleSizeChange" @current-change="handleCurrentChange" />
		</div>
	</div>

	<!-- 添加用户界面 -->
	<div v-if="isAdd" class="add-container">
		<el-form :model="newUsers" ref="form" label-width="120px" :inline="false" style="max-width: 460px">
			<el-form-item label="姓名：">
				<el-input v-model="newUsers.name"></el-input>
			</el-form-item>
			<el-form-item label="用户名：">
				<el-input v-model="newUsers.username"></el-input>
			</el-form-item>
			<el-form-item label="用户类型：">
				<el-select placeholder="请选择用户类型" v-model="newUsers.utype">
					<el-option v-for="item in characterOption" :key="item.value" :label="item.lable" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="用户性别：">
				<el-radio-group v-model="newUsers.sex">
					<el-radio label="1">男</el-radio>
					<el-radio label="0">女</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="手机号码：">
				<el-input v-model="newUsers.cellphone" />
			</el-form-item>
			<el-form-item label="用户照片：">
				<el-upload class="avatar-uploader" :http-request="uploadPic" :show-file-list="false"
					:on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
					<img v-if="newUsers.userpic" class="avatar" :src="newUsers.userpic" />
					<el-icon v-else class="avatar-uploader-icon">
						<Plus />
					</el-icon>
				</el-upload>
			</el-form-item>
			<el-form-item>
				<el-button v-if="editFlag" type="primary" @click="onEdit">修改</el-button>
				<el-button v-else type="primary" @click="onSubmit">新增</el-button>
				<el-button @click="cancel">取消</el-button>
			</el-form-item>
		</el-form>

	</div>

	<!-- 用户详细界面卡片 -->
	<div class="userInfo" v-if="userInfoFlag" @click="userInfoFlag = false">
		<el-card shadow="always" :body-style="{ padding: '20px' }" @click.stop="userInfoFlag = true">
			<template #header>
				<div class="card-header">
					<span>用户详情</span>
				</div>
			</template>
			<el-form :model="userInfo" ref="form" label-width="100px" :inline="false" style="max-width: 460px"
				label-position="left">
				<el-form-item label="用户姓名：">
					<el-input v-model="userInfo.name"></el-input>
				</el-form-item>
				<el-form-item label="用户名：">
					<el-input v-model="userInfo.username"></el-input>
				</el-form-item>
				<el-form-item label="用户电话：">
					<el-input v-model="userInfo.cellphone"></el-input>
				</el-form-item>
				<el-form-item label="用户性别：">
					<el-input v-if="userInfo.sex == '1'">男</el-input>
					<el-input v-else>女</el-input>
				</el-form-item>
				<el-form-item label="用户照片：" class="demo-image__error">
					<div class="block">
						<el-image :src="userInfo.userpic">
							<template #error>
								<div class="image-slot">
									<el-icon><icon-picture /></el-icon>
								</div>
							</template>
						</el-image>
					</div>
				</el-form-item>
			</el-form>
		</el-card>

	</div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue';
// 获取用户相关接口
import { reqGetUserList, reqAddUser, reqRemoveUser, reqEditUser, reqGetUserById, reqChangeUserStatus, reqGetUserByName } from '@/api/user';
// 获取上传文件接口
import { reqUploadFile } from '@/api/common'
import { Picture as IconPicture } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'

// 当前页码
let pageNo = ref(1)
// 页码大小
let pageSize = ref(10)
// 用户总数量
let total = ref(0)
// 是否点击添加用户
let isAdd = ref(false)
// 存储用户列表
let usersArr = ref([])
// 搜索框关键字
let keyWords = ref('')
// 查询用户详细信息的标志
let userInfoFlag = ref(false)
// 表单对象
let newUsers = ref({
	"birthday": "2023-10-12T07:17:03.632Z",
	"cellphone": "",
	"email": "",
	"name": "",
	"nickname": "",
	"qq": "",
	"sex": "",
	"username": "",
	"userpic": "",
	"utype": ""
})
// 用户角色配置选项（不这样做会出现修改用户职称时，lable不能改变的bug）
const characterOption = [
	{ value: '101001', lable: '学生' },
	{ value: '101002', lable: '老师' },
	{ value: '101003', lable: '管理员' }
]
// 用户详细信息
let userInfo = ref({
	"cellphone": "",
	"name": "",
	"sex": "",
	"username": "",
	"userpic": "",
	"utype": ""
})
// 定义标志判断是修改还是新增
let editFlag = ref(false)
// 是否正在按条件查询标志
let isConditonFlag = ref(false)

// 封装获取用户信息方法
const getUsers = async () => {
	let result = await reqGetUserList(pageNo.value, pageSize.value)
	usersArr.value = result.items
	total.value = result.counts
}
// 封装一个清空对象属性值方法
const clearObj = () => {
	newUsers.value = {
		"birthday": "2023-10-12T07:17:03.632Z",
		"cellphone": "",
		"email": "",
		"id": 0,
		"name": "",
		"nickname": "",
		"qq": "",
		"sex": "",
		"username": "",
		"userpic": "",
		"utype": ""
	}
}

// 组件挂载时获取用户信息
onMounted(() => {
	getUsers()

})

// 删除按钮回调
const removeUser = async (id: number) => {
	// 调用删除接口
	let result = await reqRemoveUser(id)
	if (result.code == 200) {
		ElMessage.success("删除成功")
	}
	// 重新获取用户信息
	await getUsers()
}

// 当前页面改变触发回调
const handleCurrentChange = async () => {

	// 判断当前是否正在按条件查询
	// 如果是，则调用按条件查询课程的接口
	if (isConditonFlag.value) {
		let result = await reqGetUserByName(keyWords.value, pageNo.value, pageSize.value)
		usersArr.value = result.items
	}
	// 否则调用基本获取课程的接口
	else {
		getUsers();
	}

}

// 页面大小改变触发回调
const handleSizeChange = async () => {
	// 判断当前是否正在按条件查询
	// 如果是，则调用按条件查询课程的接口
	if (isConditonFlag.value) {
		let result = await reqGetUserByName(keyWords.value, pageNo.value, pageSize.value)
		usersArr.value = result.items
	}
	// 否则调用基本获取课程的接口
	else {
		getUsers();
	}
}

// 修改用户按钮回调
const editUser = async (id: number) => {
	// 打开修改标志
	editFlag.value = true
	// 获取该id对应用户信息
	let result = await reqGetUserById(id)
	// 跳转到表单页面
	isAdd.value = true
	// 用户信息添加到表单
	Object.assign(newUsers.value, result.data)
}

// 确认修改按钮回调
const onEdit = async () => {
	// 发起修改请求
	let result = await reqEditUser(newUsers.value)
	if (result.code == 200) {
		ElMessage.success("修改成功")
	} else {
		ElMessage.error("修改失败")
	}
	// 清空用户对象
	clearObj()
	// 修改成功重新获取用户信息
	getUsers()
	// 关闭修改标志
	editFlag.value = false
	// 返回表格界面
	isAdd.value = false
}

// 添加用户按钮回调
const addUserBtn = () => {
	isAdd.value = true
	editFlag.value = false
}

// 确认添加按钮回调
const onSubmit = async () => {

	// 发起添加用户请求
	let result = await reqAddUser(newUsers.value)
	if (result.code == 200) {
		ElMessage.success("添加成功")
	} else {
		ElMessage.error("添加失败")
	}
	// 清空用户对象
	clearObj()
	// 重新获取用户列表
	getUsers()
	// 返回用户列表
	isAdd.value = false
}

// 上传用户图片两个钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
	if (response == '1') {
		ElMessage.success("上传成功")
	}
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
	if (rawFile.type !== 'image/jpeg') {
		ElMessage.error('必须上传图片格式!')
		return false
	} else if (rawFile.size / 1024 / 1024 > 2) {
		ElMessage.error('图片大小不能超过2MB!')
		return false
	}
	return true
}

// 自定义upload的事件覆盖el-upload的action
const uploadPic = async (param: any) => {

	// 创建FormData对象，用于将文件对象包装成表单数据
	const formData = new FormData()
	formData.append('file', param.file)
	let result = await reqUploadFile(formData)

	// 调用onSuccess钩子，传入响应式数据
	param.onSuccess(result.code, param.file)

	// 上传后从远程服务器要文件地址进行赋值
	newUsers.value.userpic = result.data

}

// 查询用户详情回调
const searchUser = async (id: number) => {
	let result = await reqGetUserById(id)
	userInfo.value = result.data
	userInfoFlag.value = true
}

// 取消按钮回调
const cancel = () => {
	isAdd.value = false
	clearObj()
}

// 禁止|启动 用户状态按钮回调
const changeUserStatus = async (id: number, status: string) => {
	await reqChangeUserStatus(id, status)
	// 修改成功重新获取用户信息
	getUsers()

}

// 点击查询按钮回调
const btnInquire = async () => {
	// 开启按条件查询课程标志
	isConditonFlag.value = true
	// 先获取当前条件下的课程总数
	let result = await reqGetUserByName(keyWords.value)
	total.value = result.items.length
	// 然后发分页请求
	pageNo.value = 1
	result = await reqGetUserByName(keyWords.value, pageNo.value, pageSize.value)
	usersArr.value = result.items
}

// 清空文本框触发回调
const handleClear = async () => {
	isConditonFlag.value = false
	pageNo.value = 1
	await getUsers();
}



</script>


<style scoped lang="scss">
.table-avatar {
	height: 60px;
	width: 60px;
}


.userInfo {
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
	width: 178px;
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
