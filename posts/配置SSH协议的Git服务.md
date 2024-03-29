---
title: "配置SSH协议的Git服务"
created: 2022-03-17T13:01:44+08:00
draft: false
tags: ["git"]
layout: "search"
---

# 配置SSH协议的Git服务

## 生成sshkey

使用命令

```sh
ssh-keygen -t ed25519 -C "xxxxx@xxx.com"  
```

其中`-t(type)`选择加密类型，`-C(comment)`为备注信息

按照提示回车即可。其中第二步的 `passphrase` 是对密钥对的私钥进行加密的。

之后会在 `~/.ssh` 内生成两个文件，分别是 `id_ed25519` `id_ed25519.pub` 其中前者为私钥，后者为公钥。

## 在Gitee添加公钥

单独仓库添加：

仓库主页 **「管理」->「部署公钥管理」->「添加部署公钥」** ，添加生成的 public key 添加到仓库中。

也可以在 **「个人主页」-> 「安全设置」**内添加

## 测试SSH连接

```sh
ssh -T git@gitee.com
```

`-T(test)` 表示测试连接，不显示终端只显示连接结果信息



## 更换git remote url

如果以前配置过git remote地址，即 `git remote -v` 输出 url 格式仍为 https 格式。使用一下命令修改：

```sh
git remote set-url origin git@gitee.com:用户名/仓库名.git
# 例如
git remote set-url origin git@gitee.com:mayapony/blog.git
```

---

顺便用

```shell
scp ~/.ssh/id_ed25519.pub 用户名@服务器地址:~/.ssh/id_ed25519.pub 

# 登陆服务器，以下命令在服务器执行，把公钥内容添加到 authorized_keys 文件中
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
```

这样以后使用`ssh`连接服务器也不需要输入密码了。
