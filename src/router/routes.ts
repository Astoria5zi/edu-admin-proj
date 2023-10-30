export const constantRoute = [
	// 登录路由
	{
		path: '/login',
		component: () => import('@/views/login/index.vue'),
		name: 'login', // 命名路由
		meta: {
			title: '登录', //菜单标题
			hidden: true, // 是否隐藏
			icon: 'Promotion', // 图标
		}
	},

	// 首页路由
	{
		path: '/',
		component: () => import('@/views/Indexpage/index.vue'),
		name: 'layout', // 命名路由
		meta: {
			title: '', //菜单标题
			hidden: false, // 是否隐藏
			icon: '', // 图标
		},
	},
	// 课程列表路由
	{ path: '/courselist', component: () => import('@/views/courselist/index.vue'), name: 'courselist' },

	// 个人中心路由
	{
		path: '/userpage', component: () => import('@/views/userpage/index.vue'), name: 'userpage', redirect: '/userpage/myinfo',
		children: [
			// 个人信息子路由
			{
				path: '/userpage/myinfo', component: () => import('@/components/Usermenu/MyInfo/index.vue'), name: 'MyInfo',
				meta: {
					title: '个人信息', //菜单标题
				}
			},
			{
				path: '/userpage/mycourse', component: () => import('@/components/Usermenu/Mycourse/index.vue'), name: 'Mycourse',
				meta: {
					title: '我的课程', //菜单标题
				}
			},
			{
				path: '/userpage/mystar', component: () => import('@/components/Usermenu/Mystar/index.vue'), name: 'Mystar',
				meta: {
					title: '我的收藏', //菜单标题
				}
			},
			{
				path: '/userpage/myorder', component: () => import('@/components/Usermenu/Myorder/index.vue'), name: 'Myorder',
				meta: {
					title: '我的订单', //菜单标题
				}
			},
		]

	},
	// 课程播放路由
	{ path: '/coursevideo', component: () => import('@/views/coursevideo/index.vue'), name: 'coursevideo' },
	// 管理中心路由
	{
		path: '/admin',
		component: () => import('@/views/admin/index.vue'),
		name: 'admin',
		meta: {
			title: '管理中心', //菜单标题
		},
		redirect: '/admin/home',
		children: [
			// 管理中心 -- 首页
			{
				path: '/admin/home', component: () => import('@/views/admin/views/home/index.vue'), name: 'adminhome',
				meta: {
					title: '首页',
				},
			},
			// 管理中心 -- 学生管理
			{
				path: '/admin/student', component: () => import('@/views/admin/views/student/index.vue'), name: 'student',
				meta: {
					title: '学生管理',
				},
			},
			// 管理中心 -- 学生管理
			{
				path: '/admin/stuselectcourse', component: () => import('@/views/admin/views/stuselectcourse/index.vue'), name: 'stuselectcourse',
				meta: {
					title: '学生选课',
				},
			},
			// 管理中心 -- 教师管理
			{
				path: '/admin/teacher', component: () => import('@/views/admin/views/teacher/index.vue'), name: 'teacher',
				meta: {
					title: '教师管理',
				},
			},
			// 管理中心 -- 课程管理
			{
				path: '/admin/course', component: () => import('@/views/admin/views/course/index.vue'), name: 'course',
				meta: {
					title: '课程管理',
				}
			},
			// 管理中心 -- 课程审核
			{
				path: '/admin/coursecheck', component: () => import('@/views/admin/views/coursecheck/index.vue'), name: 'coursecheck',
				meta: {
					title: '课程审核',
				}
			},
			// 管理中心 -- 用户管理
			{
				path: '/admin/user', component: () => import('@/views/admin/views/user/index.vue'), name: 'user',
				meta: {
					title: '用户管理',
				},
			},
			// 管理中心 -- 订单管理
			{
				path: '/admin/order', component: () => import('@/views/admin/views/order/index.vue'), name: 'order',
				meta: {
					title: '订单管理',
				},
			},
			// 管理中心 -- 班级管理
			{
				path: '/admin/lesson', component: () => import('@/views/admin/views/lesson/index.vue'), name: 'lesson',
				meta: {
					title: '班级管理',
				},
			}
		]
	},
]