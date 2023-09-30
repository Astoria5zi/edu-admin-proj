<template>
	<el-tabs class="demo-tabs">
		<el-tab-pane label="基础信息">
			<el-form label-width="100px" :model="formLabelAlign" style="max-width: 460px">
				<el-form-item label="手机号：">
					<el-input v-model="formLabelAlign.name" />
				</el-form-item>
				<el-form-item label="昵称：">
					<el-input v-model="formLabelAlign.region" />
				</el-form-item>
				<el-form-item label="年龄：">
					<el-input v-model="formLabelAlign.type" />
				</el-form-item>
				<el-form-item label="邮箱：">
					<el-input v-model="formLabelAlign.type" />
				</el-form-item>
				<el-form-item label="头像：">
					<el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
						:show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
						<img v-if="imageUrl" :src="imageUrl" class="avatar" />
						<el-icon v-else class="avatar-uploader-icon">
							<Plus />
						</el-icon>
					</el-upload>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit" style="width: 100%;">修改</el-button>
				</el-form-item>
			</el-form>

		</el-tab-pane>

	</el-tabs>
</template>
<script setup lang="ts">
import { reactive } from 'vue'



const formLabelAlign = reactive({
	name: '',
	region: '',
	type: '',
})


// 官网抄的上传图片代码
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps } from 'element-plus'

const imageUrl = ref('')

const handleAvatarSuccess: UploadProps['onSuccess'] = (
	uploadFile
) => {
	imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
	if (rawFile.type !== 'image/jpeg') {
		ElMessage.error('Avatar picture must be JPG format!')
		return false
	} else if (rawFile.size / 1024 / 1024 > 2) {
		ElMessage.error('Avatar picture size can not exceed 2MB!')
		return false
	}
	return true
}

// 点击提交按钮触发回调
const onSubmit = () => {

}
</script>


<style scoped lang="scss"></style>
