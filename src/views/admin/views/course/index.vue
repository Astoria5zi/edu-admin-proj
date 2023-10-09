<template>
  <!-- 展示课程列表以及操作 -->
  <div v-if="!isAdd" class="teacher-table">
    <!-- 搜索框
		<el-input placeholder="输入课程名称" :suffix-icon="Search" style="width: 200px ;" v-model="keyWords" /> -->

    <!-- 课程的级联选择器 -->
    <el-cascader v-model="cascaderValue" :options="treeNodeCourseArr" @change="handleChange" :props="cascaderProps">
      <template #default="{ node, data }">
        <span>{{ data.label }}</span>
        <span v-if="!node.isLeaf"> ({{ data.childrenTreeNodes.length }}) </span>
      </template>
    </el-cascader>

    <!-- 添加课程按钮 -->
    <el-button type="primary" size="default" @click="isAdd = true" style="margin: 10px">添加课程</el-button>

    <!-- 展示课程列表 -->
    <el-table :data="computedCoursesArr" border style="width: 100%" max-height="650">
      <el-table-column label="序号" type="index" algin="center" width="60"></el-table-column>
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="name" label="课程名称" width="180" />
      <el-table-column prop="description" label="课程简介" show-overflow-tooltip />
      <el-table-column prop="createPeople" label="授课教师" width="120" show-overflow-tooltip />
      <el-table-column prop="users" label="适合人群" width="120" show-overflow-tooltip />
      <el-table-column prop="status" label="课程状态" width="100" />
      <el-table-column prop="pic" label="课程封面" width="120" show-overflow-tooltip />

      <el-table-column label="操作" width="200">
        <template #="{ row }">
          <el-button type="primary" size="small" @click="" icon="Edit" title="修改课程信息"></el-button>
          <el-button type="primary" size="small" @click="searchCourse(row.id)" icon="Search" title="查看课程信息"></el-button>
          <el-popconfirm title="确认删除吗?" @confirm="removeCourse(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete" title="删除课程"></el-button>
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
    <el-form :model="newTeacher" ref="form" label-width="120px" :inline="false" style="max-width: 460px">
      <el-form-item label="教师姓名：">
        <el-input v-model="newTeacher.name"></el-input>
      </el-form-item>
      <el-form-item label="教师职称：" v-model="newTeacher.resume">
        <el-select placeholder="please select your level">
          <el-option label="讲师" value="lecturer" />
          <el-option label="副教授" value="associate" />
          <el-option label="教授" value="professor" />
        </el-select>
      </el-form-item>
      <el-form-item label="教师简介：">
        <el-input type="textarea" v-model="newTeacher.intro" />
      </el-form-item>
      <el-form-item label="教师照片：">
        <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false">
          <img v-if="false" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">添加教师</el-button>
        <el-button @click="isAdd = false">取消</el-button>
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
        <el-form-item label="咨询电话：">
          <el-input v-model="courseInfo.phone"></el-input>
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
import { Search } from "@element-plus/icons-vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { Picture as IconPicture } from "@element-plus/icons-vue";
// 获取课程相关接口
import { reqCourseList, reqGetCourseById, reqGetTreeNodeCourse, reqGetTreeNodeCourseById } from "@/api/course";

// 当前页码
let pageNo = ref(1);
// 页码大小
let pageSize = ref(5);
// 教师总数量
let total = ref(0);
// 是否点击添加教师
let isAdd = ref(false);
// 存储课程列表
let coursesArr = ref([]);
// 搜索框关键字
let keyWords = ref("");
// 计算属性课程列表
const computedCoursesArr = computed(() => {
  return coursesArr.value.filter((item: any) => {
    return item.name.includes(keyWords.value);
  });
});
// 查询课程详细信息的标志
let courseInfoFlag = ref(false);
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
let newCourse = ref({});
// 树状课程数组
let treeNodeCourseArr = ref([]);
// 级联选择器绑定值
let cascaderValue = ref([]);
// 级联选择器配置对象
const cascaderProps = {
  children: "childrenTreeNodes",
  expandTrigger: "hover",
  value: 'id',
  label: 'label'
};

// 封装获取课程方法
const getCourses = async () => {
  let result = await reqCourseList(pageNo.value, pageSize.value, {
    auditStatus: "",
    courseName: "",
  });
  coursesArr.value = result.items;
  total.value = result.counts;
};

// 组件挂载时获课程师信息
onMounted(async () => {
  getCourses();

  // 获取所有一级分类ID
  let result = await reqGetTreeNodeCourse();
  treeNodeCourseArr.value = result;
  console.log(result);
});

// 搜索框关键字发生变化
watch(computedCoursesArr, () => {
  // console.log(computedCoursesArr.value);
});

// 删除按钮回调
const removeCourse = async (id: number) => {
  // 发起删除请求
  console.log(id);
};

// 当前页面改变触发回调
const handleCurrentChange = () => {
  getCourses();
};

// 页面大小改变触发回调
const handleSizeChange = () => {
  getCourses();
};

// 查看课程按详细信息按钮回调
const searchCourse = async (id: number) => {
  let result = await reqGetCourseById(id);
  courseInfo = result;
  // 等数据获取完毕后再开启遮罩层
  courseInfoFlag.value = true;
};

// 确认添加按钮回调
const onSubmit = async () => {
  // 返回教师列表
  isAdd.value = false;

  // 发起添加教师请求
  let result = await reqAddTeacher(newTeacher);
  console.log(result);
};

// 级联选择器绑定值变化触发回调
const handleChange = async (value) => {
  console.log(value);

  let result = await reqGetTreeNodeCourseById(value.at(-1))
  console.log(result);

};


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
