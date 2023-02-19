---
title: "修复Emacs代码块的鬼畜缩进"
date: 2022-03-15T00:00:25+08:00
draft: false
tags: ["踩坑记录", "Emacs", "Org-mode"]
---

## 问题描述

今天想学习一下 `elisp` 写一个 `Emacs` 的插件，顺便使用 `Org-mode` 来记录，顺便熟悉一下 `org-mode` 的使用。
谁曾想，~~org-mode 却把我伤的这么彻底 55~~

---

下面是当时的效果：每次按下回车 当前行上面的代码就会进行缩进，**很奇怪！！！**

![一个截图](/images/Peek2022-03-14-23-58.gif)

## 解决办法

将变量 `org-edit-src-content-indentation` 变量的值设置为 0 即可。
同时，也推荐使用 `C-c '` 另开 `buffer` 来编辑代码。

结！
