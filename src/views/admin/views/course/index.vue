<template>
  <!-- 展示课程列表以及操作 -->
  <div v-if="!isAdd" class="teacher-table">

    <!-- 课程的级联选择器 -->
    <el-cascader v-model="cascaderValue" :options="treeNodeCourseArr" @change="handleChange" :props="cascaderProps"
      clearable>
      <template #default="{ node, data }">
        <span>{{ data.label }}</span>
        <span v-if="!node.isLeaf"> ({{ data.childrenTreeNodes.length }}) </span>
      </template>
    </el-cascader>

    <!-- 课程查询按钮 -->
    <el-button type="primary" @click="btnInquire" style="margin: 10px 0px 10px 10px">查询</el-button>

    <!-- 添加课程按钮 -->
    <el-button type="primary" size="default" @click="btnAddCourse">添加课程</el-button>

    <!-- 展示课程列表 -->
    <el-table :data="coursesArr" border style="width: 100%" max-height="700">
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
      <el-table-column label="课程审批" width="140" align="center">
        <!-- 课程发布后不能再审核|发布|驳回 -->
        <!-- 课程未提交审核也不能 发布|驳回-->
        <template #="{ row }">
          <el-popconfirm title="确认发布吗?" @confirm="publishCourse(row.id)">
            <template #reference>
              <el-button :disabled="row.status == 203002 || row.auditStatus == 202002" type="primary" size="small"
                icon="Check" title="发布课程"></el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm title="确认驳回吗?" @confirm="rejectCourse(row.id)">
            <template #reference>
              <el-button :disabled="row.status == 203002 || row.auditStatus == 202002" type="danger" size="small"
                icon="Close" title="驳回课程"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-table-column label="基本操作" width="180" align="center">
        <!-- 已发布|提交审核的课程不能修改和删除 -->
        <template #="{ row }">
          <el-button :disabled="row.status == 203002 || row.auditStatus == 202003" type="primary" size="small"
            @click="editCourse(row.id)" icon="Edit" title="修改课程信息"></el-button>
          <el-button type="primary" size="small" @click="searchCourse(row.id)" icon="Search" title="查看课程信息"></el-button>
          <el-popconfirm title="确认删除吗?" @confirm="removeCourse(row.id)">
            <template #reference>
              <el-button :disabled="row.status == 203002 || row.auditStatus == 202003" type="danger" size="small" icon="Delete" title="删除课程"></el-button>
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

  <!-- 添加课程界面 -->
  <div v-if="isAdd" class="add-container">
    <el-form ref="ruleFormRef" :model="newCourse" label-width="120px" :inline="false" style="max-width: 460px"
      :rules="rules">
      <el-form-item label="课程名称：" prop="name">
        <el-input v-model="newCourse.name"></el-input>
      </el-form-item>
      <el-form-item label="当前定价：" prop="price">
        <el-input v-model="newCourse.price"></el-input>
      </el-form-item>
      <el-form-item label="起始价格：" prop="originalPrice">
        <el-input v-model="newCourse.originalPrice"></el-input>
      </el-form-item>
      <el-form-item label="课程分类：" prop="st">
        <el-cascader v-model="newCourse.st" :options="treeNodeCourseArr" @change="chooseSt" :props="cascaderProps">
          <template #default="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.childrenTreeNodes.length }}) </span>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item label="授课教师：" prop="teacherId">
        <el-select v-model="newCourse.teacherId" placeholder="请选择">
          <el-option v-for=" item  in  teachersIdArr " :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="有效日期：">
        <el-input v-model="newCourse.validDays" />
      </el-form-item>
      <el-form-item label="适用人群：">
        <el-input v-model="newCourse.users" />
      </el-form-item>
      <el-form-item label="课程描述：">
        <el-input type="textarea" v-model="newCourse.description" />
      </el-form-item>
      <el-form-item label="课程照片：">
        <el-upload class="avatar-uploader" :http-request="uploadPic" :show-file-list="false">
          <img v-if="newCourse.pic" class="avatar" :src="newCourse.pic" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button v-if="idEdit" type="primary" @click="onEdit">修改课程</el-button>
        <el-button v-else type="primary" @click="onSubmit(ruleFormRef)">添加课程</el-button>
        <el-button @click="btnCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 课程详细界面卡片 -->
  <div class="courseinfo" v-if="courseInfoFlag" @click="courseInfoFlag = false">
    <el-card shadow="always" :body-style="{ padding: '20px' }" @click.stop="courseInfoFlag = true">
      <template #header>
        <div class="card-header">
          <span>课程详情</span>
        </div>
      </template>
      <el-form :model="courseInfo" ref="form" label-width="100px" :inline="false" style="max-width: 460px"
        label-position="left">
        <el-form-item label="课程名称：">
          <el-input v-model="courseInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="课程分类：">
          <el-input v-model="courseInfo.stName"></el-input>
        </el-form-item>
        <el-form-item label="课程价格：">
          <el-input v-model="courseInfo.stName"></el-input>
        </el-form-item>
        <el-form-item label="课程有效期：">
          <el-input v-model="courseInfo.validDays"></el-input>
        </el-form-item>
        <el-form-item label="课程封面：" class="demo-image__error">
          <div class="block">
            <el-image :src="courseInfo.pic">
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
import { onMounted, reactive, ref } from "vue";
import { Picture as IconPicture } from "@element-plus/icons-vue";
// 获取课程相关接口
import {
  reqCourseList,
  reqGetCourseById,
  reqGetTreeNodeCourse,
  reqGetCourseBySt,
  reqAddNewCourse,
  reqRemoveCourse,
  reqEditCourse,
  reqPublishCourse
} from "@/api/course";
// 引入教师相关接口
import { reqGetTeacherList } from "@/api/teacher";
// 获取上传文件接口
import { reqUploadFile } from '@/api/common'
// 引入表单校验格式
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

// 当前页码
let pageNo = ref(1);
// 页码大小
let pageSize = ref(10);
// 课程总数量
let total = ref(0);
// 是否点击添加课程
let isAdd = ref(false);
// 是否点击修改课程
let idEdit = ref(false)
// 存储课程列表
let coursesArr = ref([]);
// 查询课程详细信息的标志
let courseInfoFlag = ref(false);
// 获取教师id数组
let teachersIdArr = ref()
// 存储课程详细信息
let courseInfo = reactive({
  name: "",
  charge: "",
  price: "",
  originalPrice: "",
  qq: "",
  wechat: "",
  phone: "",
  validDays: "",
  mtName: "",
  stName: "",
  pic: "",
});
// 新增课程表单对象
let newCourse = ref({

  "charge": "201001", // 000免费 001收费
  "price": '',
  "originalPrice": '',
  "validDays": '',
  "mt": "",
  "st": "",
  "name": "",
  "pic": "无",
  "users": "初级人员",
  "description": "",
  "mtName": "",
  "stName": "",
  "teacherId": "",
  "teacherName": ""
});
// 绑定表单校验对象
const ruleFormRef = ref<FormInstance>()
// 表单校验规则
const rules = reactive({
  charge: [{ required: true, message: '请选择收费类型', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  originalPrice: [{ required: true, message: '请输入原价', trigger: 'blur' }],
  validDays: [{ required: true, message: '请输入有效期', trigger: 'blur' }],
  mt: [{ required: true, message: '请输入MT', trigger: 'blur' }],
  st: [{ required: true, message: '请输入ST', trigger: 'blur' }],
  name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  pic: [{ required: true, message: '请输入图片地址', trigger: 'blur' }],
  users: [{ required: true, message: '请输入用户类型', trigger: 'blur' }],
  description: [{ required: true, message: '请输入课程描述', trigger: 'blur' }],
  mtName: [{ required: true, message: '请输入MT名称', trigger: 'blur' }],
  stName: [{ required: true, message: '请输入ST名称', trigger: 'blur' }],
  teacherId: [{ required: true, message: '请输入教师ID', trigger: 'blur' }],
  teacherName: [{ required: true, message: '请输入教师姓名', trigger: 'blur' }]
});
// 树状课程数组
let treeNodeCourseArr = ref([]);
// 级联选择器绑定值
let cascaderValue = ref<string[]>([]);
// 级联选择器配置对象
const cascaderProps = {
  children: "childrenTreeNodes",
  expandTrigger: "hover",
  value: 'id',
  label: 'label'
};
// 是否正在按条件查询标志
let isConditonFlag = ref(false)
// 封装获取课程方法
const getCourses = async () => {
  let result = await reqCourseList(pageNo.value, pageSize.value, {
    auditStatus: "",
    courseName: "",
  });

  coursesArr.value = result.data.items;
  total.value = result.data.counts;
};

// 组件挂载时获课程师信息
onMounted(async () => {
  getCourses();
  // 获取所有一级分类ID
  treeNodeCourseArr.value = await reqGetTreeNodeCourse();
  // 获取所有教师信息(用于新增课程时选择教师)
  let result = await reqGetTeacherList()
  teachersIdArr.value = result.data.items.map((item: any) => ({ id: item.id, name: item.name }));

});

// 删除按钮回调
const removeCourse = async (id: number) => {
  // 发起删除请求
  await reqRemoveCourse(id)
  await getCourses()
};

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

// 查看课程按详细信息按钮回调
const searchCourse = async (id: number) => {
  let result = await reqGetCourseById(id);
  courseInfo = result;
  // 等数据获取完毕后再开启遮罩层
  courseInfoFlag.value = true;
};

// 添加课程按钮回调
const btnAddCourse = () => {
  isAdd.value = true
}

// 确认添加按钮回调
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      // 返回课程列表
      isAdd.value = false;
      // 成功提醒
      ElMessage.success("添加成功")
      // 发起添加课程请求
      await reqAddNewCourse(newCourse.value);
      getCourses();

    } else {
      console.log('error submit!', fields)
    }
  })

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

// 新增课程中的级联选择器变化触发回调
const chooseSt = (value: any) => {
  newCourse.value.st = value.at(-1)
  newCourse.value.mt = value.at(0)
}

// 修改课程按钮回调
const editCourse = async (id: number) => {
  newCourse.value = await reqGetCourseById(id)
  console.log(newCourse.value);

  idEdit.value = true
  isAdd.value = true
}

// 确定修改按钮回调
const onEdit = async () => {
  await reqEditCourse(newCourse.value)
  getCourses()
  // 关闭表单页面
  isAdd.value = false
  // 擦除修改标识
  idEdit.value = false
}

// 新增/修改界面的取消按钮
const btnCancel = () => {
  isAdd.value = false
  idEdit.value = false
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
  newCourse.value.pic = result.data

}

// 确认发布课程按钮回调
const publishCourse = async (id: number) => {
  let result = await reqPublishCourse(id, '202004')
  if(result.code == 200){
    ElMessage.success("发布成功")
    getCourses()
  }else{
    ElMessage.error("发布失败")
  }
  
}

// 确认驳回课程按钮回调
const rejectCourse = async (id: number) => {
  await reqPublishCourse(id, '202001')
  getCourses()
}


</script>









<style scoped lang="scss">
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
