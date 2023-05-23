---
title: "[阅读记录]Routing Fundamentals🚧"
created: 2023-05-23T22:18:45+08:00
updated: 2023-05-23T22:53:14+08:00
tags: ["nextjs"]
---

source: https://nextjs.org/docs/app/building-your-application/routing

## 重点

1. app 比 page 的优先级更高
2. 文件和文件夹的作用
	- 文件夹定义路由
	- 文件定义UI
3. 通过嵌套文件夹实现嵌套路由
4. 各文件功能（支持.js .jsx tsx）
	- page.js 为当前路由创建UI，使该路由可以被访问
	- route.js 创建服务端的api
	- layout.js 创建布局可以包裹 `page` 或者 `child segment`
	- template.js 和layout类似（没看懂）
	- loading.js 创建加载UI
	- error.js 错误页面
	- not-found.js 页面不存在页面
5. 不同文件对应的组件在页面元素中的层级关系
	![Component Hierarchy for File Conventions](https://nextjs.org/_next/image?url=%2Fdocs%2Flight%2Ffile-conventions-component-hierarchy.png&w=3840&q=75)
6. 除了上面这些特殊的文件，也可以在一个 `segment route` 文件夹里集中的管理自己的文件，例如样式、测试、组件
	![Component colocation inside the App Router](https://nextjs.org/_next/image?url=%2Fdocs%2Flight%2Fcomponent-collocation.png&w=3840&q=75)
7. 使用 Link 组件进行路由导航
8. sibling routes间的渲染是部分渲染的，提升了性能
9. 两种高级路由匹配的方法
	-   [Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes): Allow you to simultaneously show two or more pages in the same view that can be navigated independently. You can use them for split views that have their own sub-navigation. E.g. Dashboards. 允许同步展示多个页面，并且各个页面能进行独立的导航
	-   [Intercepting Routes](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes): Allow you to intercept a route and show it in the context of another route. You can use these when keeping the context for the current page is important. E.g. Seeing all tasks while editing one task or expanding a photo in a feed. 路由拦截




## 问题，以后再看

Additionally, as users navigate around the app, the router will store the result of the React Server Component payload in an **in-memory client-side cache**. The cache is split by route segments which allows invalidation at any level and ensures consistency across [React's concurrent renders](https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react). ==This means that for certain cases, the cache of a previously fetched segment can be re-used, further improving performance.==
行吧，总结就是性能被提升了

