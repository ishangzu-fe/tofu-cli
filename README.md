# Pan🍳

> Simple CLI for scaffolding Vue.js projects
<a href="https://www.npmjs.com/package/tofu-cli">
<img src="https://api.travis-ci.org/ishangzu-fe/pan.svg?branch=dev" alt="Build Status">
</a>

## 核心

简单易用当然是我的目标之一，准确来说，我希望给开发者们提供一个“无压”的开发环境。
每个人的精力都是有限的，因为有限，我们就需要将注意力集中在项目的核心 -- 代码上。但是现实的开发环境并不是如此，我们时常被代码之外的内容夺去注意力，甚至花上更多的精力去处理这些并不能让代码变得更好的东西上。所以我选择将代码之外的这部分内容剥离。

## 介绍

现在来简单介绍下项目的构成，它主要由这几部分内容构成：

- 项目搭建
- 开发环境
- 项目打包
- 内容更新
- 代码校验

分别对应着五个命令：

- tofu init
- tofu server
- tofu build
- tofu update
- tofu lint

现在来介绍下这些命令的用法。

## 用法

### init

~~~bash
tofu init
~~~

### server

~~~bash
tofu server

# 指定端口
tofu server [-p|--port <port>]
~~~

### build

~~~bash
tofu build
~~~

### update

~~~bash
tofu update
~~~

### lint

~~~bash
tofu lint

# 自动修复
tofu lint [-f|--fix]
~~~
