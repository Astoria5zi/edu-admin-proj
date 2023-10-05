### 9.22 
引入啥外部组件都要在main.ts里配置吗

### 10.5
1. 对于查询时，页面改变存在问题
- 查询教师是按照分页进行的，如请求参数 `pageNo=${pageNo}&pageSize=${pageSize}`
- 但是同时对于el-pagenation组件，我绑定了pagesizeChange事件和totalChange事件，一旦数组数量和当前页面发生改变就会
  重新发请求获取当前分页下的数据
- 这样就和按名称查询教师发生了冲突，我按关键字获取到了对应的新数组，但是这样就导致了数组大小的改变，然后就会触发
  SizeChange和totalChange事件，新获取的数组就又被覆盖了。
2. 修复Bug,当浏览器页面缩小时，表格部分不会超出侧边栏高度
3. 修改LOGO标题和网页title,更换LOGO图片