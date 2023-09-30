<template>
  <!-- 课程卡片页面 -->
  <div class="card_zone">
    <!-- 标题部分 -->
    <!-- <div class="zone_header">
      <span class="big_text">Java系列</span>
      <span class="small_text">底层与算法+大型架构设计+微服务</span>
    </div> -->
    <!-- 课程展示部分 -->
    <div class="zone">
      <el-row>
        <el-col :span="6">
          <el-card :body-style="{ padding: '0px' }" shadow="always">
            <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
              class="image" />
            <div style="padding: 14px">
              <span>Java基础</span>
              <span class="zone_small_text">免费</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

  </div>
</template>
<script setup lang="ts">

</script>


<style scoped lang="scss">
.card_zone {
  margin-top: 20px;
  width: 100%;

  .zone_header {
    display: flex;
    align-items: center;

    height: 45px;

    .big_text {
      margin-left: 10px;
      font-size: 24px;
    }

    .small_text {
      font-size: 14px;
      color: #999;
      margin-top: 10px;
      margin-left: 10px;
      vertical-align: baseline;
    }

  }

  .zone {
    margin-top: 5px;

    .el-card {
      padding-top: 10px;
      margin: 5px;
      display: flex;
      justify-content: center;

    }

    .zone_small_text {
      font-size: 14px;
      color: #999;
      margin-top: 10px;
      margin-left: 10px;
      vertical-align: baseline;
    }
  }
}
</style>
