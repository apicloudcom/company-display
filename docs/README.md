# 企业展示项目源码解析

> 此项目为企业展示类应用，主要功能包括企业信息展示、案例展示、加盟申请等。
> 
> 项目源码在 https://github.com/apicloudcom/company-display 仓库的 widget 目录下。

项目中前端技术要点包括 TabLayout 布局、swiper 轮播图、rich-text 富文本、scroll-view 滚动视图、下拉刷新等。使用 APICloud 多端技术进行开发，实现一套代码多端运行，支持编译成 Android & iOS App 以及微信小程序。

项目后端则是使用的 [APICloud 数据云 3.0](https://docs.apicloud.com/Cloud-API/sentosa) 自定义云函数来构建的。

![preview](preview.jpg)

### 使用步骤

1. 使用 [APICloud Studio 3](https://www.apicloud.com/studio3) 作为开发工具。
2. 下载本项目源码。
3. 在开发工具中新建项目，并将本源码导入新建的项目中，注意更新 config.xml 中的 appid 为你项目的 appid。
4. 使用 AppLoader 进行真机同步调试预览。
5. 或者提交项目源码，并为当前项目云编译自定义 Loader 进行真机同步调试预览。
6. [云编译](https://www.apicloud.com/appoverview) 生成 Android & iOS App 以及微信小程序源码包。

如果之前未接触过 APICloud 开发，建议先了解一个简单项目的初始化、预览、调试和打包等操作，请参考 [APICloud 多端开发快速上手教程](https://github.com/apicloudcom/hello-app/blob/main/README.md)。

## 网络请求接口封装

在 utils/model.js 中，为每一个网络请求接口封装了对应方法，如首页获取轮播图接口 Model.getbannersList，这些方法最终会调用 Model.request 方法，在 Model.request 方法中对整个项目的请求进行统一管理，包括处理传入参数、拼装请求 url、设置请求头等，最后调用 api.ajax 方法发起请求。

使用示例：

```js
// 通过 import 引入
import {Model} from "../../utils/model.js"

// 调用 Model 对象方法
Model.getbannersList({}, (res) => {});
```

## TabBar 和导航栏的实现

首页使用了 TabLayout 布局来实现 TabBar 和导航栏，在 config.xml 里面配置 content 字段，值为 json 文件路径，在 json 文件中配置 TabBar、导航栏和页面信息。

```xml
// config.xml
<content src="config.json" />
```

config.json 文件内容如下，设置了 navigationBar 的背景色和标题文字颜色，设置了 tabBar 每项的 icon 和文字，以及每项对应的页面。

```js
{
  "name": "root",
  "hideNavigationBar": false,
  "navigationBar": {
    "background": "#fff",
    "color": "#000",
    "hideBackButton": true
  },
  "tabBar": {
    "scrollEnabled": false,
    "background": "#fff",
    "shadow": "#f1f1f1",
    "color": "#5e5e5e",
    "selectedColor": "#333333",
    "preload": 0,
    "frames": [{
      "name": "page1",
      "url": "pages/index/index.stml",
      "title": "首页"
    }, {
      "name": "page2",
      "url": "pages/case/case.stml",
      "title": "案例"
    }, {
      "name": "page3",
      "url": "pages/join/join.stml",
      "title": "加盟代理"
    }],
    "list": [{
      "iconPath": "images/toolbar/home@no_selected.png",
      "selectedIconPath": "images/toolbar/home@selected.png",
      "text": "首页"
    }, {
      "iconPath": "images/toolbar/case@no_selected.png",
      "selectedIconPath": "images/toolbar/case@selected.png",
      "text": "案例"
    }, {
      "iconPath": "images/toolbar/join@no_selected.png",
      "selectedIconPath": "images/toolbar/join@selected.png",
      "text": "加盟代理"
    }]
  }
}
```

从上面的效果图中我们可以看到”加盟代理“页面隐藏了导航栏，而其它页面没有隐藏。”加盟代理“页面路径为 pages/join/join.stml，我们参照微信小程序的语法，在同目录下放置了 join.json 文件，在里面配置 navigationStyle 字段为 custom。

```js
{
  "navigationBarTitleText": "加盟代理",
  "backgroundColor": "#FFFFFF",
  "navigationStyle":"custom"
}
```

在首页 index.stml 的 apiready 方法里面则监听了 tabBar 每项的点击事件，在 App 端，我们需要在点击事件里面动态设置页面显示、隐藏导航栏。

```js
// index.stml
api.addEventListener({
	name:'tabitembtn'
}, function(ret){
	var hideNavigationBar = ret.index == 2;
	api.setTabLayoutAttr({
		hideNavigationBar: hideNavigationBar,
		animated: false
	});
	api.setTabBarAttr({
		index: ret.index
	});
});
```

## 首页轮播图

首页路径为 pages/index/index.stml，里面轮播图使用 swiper 组件实现，使用 v-for 指令循环 swiper-item，bannersList 为定义的数组类型的属性，在首页的 apiready 方法里面，我们通过调用 getbannersList 方法发起网络请求，获取轮播图片列表数据后赋值给 bannersList 属性。这里监听了 swiper-item 的 click 事件，点击后需要跳转到详情页面。

```html
<view style={'height:'+swiperHeight+'px;'} class="swiper-box">
	<swiper class="swiper" autoplay indicator-dots indicator-color="rgba(255,255,255,0.2)" indicator-active-color="rgba(51,51,51,1)">
		<swiper-item v-for="(item_,index_) in bannersList" data-index={index_} onclick="bindBanner">
			<image src={item_.image} class="banner-image" mode="aspectFill"></image>
		</swiper-item>
	</swiper>
</view>
```

轮播图的宽度跟随屏幕宽度变化，高度则通过计算属性 swiperHeight 来动态计算得到。

```js
computed:{
	swiperHeight(){
		return api.winWidth*0.42;
	}
}
```

## rich-text 富文本的使用

由于项目是信息展示类型，运营人员会在管理后台直接编辑提交富文本信息，因此在项目中很多地方使用了 rich-text 来展示信息，比如在首页中，产品展示和关于信息部分就是使用的 rich-text，如果没为 rich-text 设置高度，其高度就为里面内容的高度。

```js
<view class="goods">
	<rich-text v-if={{product_description}} nodes={product_description} />
</view>
<view class="about">
	<rich-text v-if={{about_us}} nodes={about_us} />
</view>
```

rich-text 用于展示 HTML String 片段，在从服务器获取到 HTML String 后，我们调用 $util.fitRichText 方法处理了一下 HTML String，在 fitRichText 方法中为 img 标签加了最大宽度的限制，以防止图片宽度过大导致显示溢出。

```js
// util.js
fitRichText(richtext, width){
   var str = `<img style="max-width:${width}px;"`;
   var result = richtext.replace(/\<img/gi, str);
   return result;
}
```

## 下拉刷新、滚动到底部加载更多

在”案例“页面（pages/case/case.stml），通过 scroll-view 实现了案例列表展示，同时实现了下拉刷新、滚动到底部加载更多功能。

```stml
<scroll-view class="main" scroll-y enable-back-to-top refresher-enabled refresher-triggered={refresherTriggered} onrefresherrefresh={this.onrefresherrefresh} onscrolltolower={this.onscrolltolower}>
	<view>
		<view class="item" data-id={item.id} onclick={this.openCaseInfo} v-for="(item, index) in caseList">
			<image src={item.cover_img} class="item-img"></image>
			<text class="item-title">{{item.title}}</text>
		</view>
	</view>
   <view class="footer">
       <text class="loadDesc">{loadStateDesc}</text>
   </view>
</scroll-view>
```

下拉刷新使用了 scroll-view 默认的下拉刷新样式，使用 refresher-enabled 字段来开启下拉刷新，为 refresher-triggered 字段绑定了 refresherTriggered 属性来控制下拉刷新状态，需要注意的是，在刷新的事件回调方法里面，我们需要主动设置 refresherTriggered 的值为 true，在数据加载完成后再设置为 false，这样绑定的值有变化，刷新状态才能通知到原生里面。

```js
onrefresherrefresh(){
	this.data.refresherTriggered = true;
	this.loadData(false);
}
```

滚动到底部监听了 scroll-view 的 scrolltolower 事件，在滚动到底部后自动加载更多数据，加载更多和下拉刷新都是调用 loadData 方法请求数据，通过 loadMore 参数来进行区分，做分页请求处理。

```js
loadData(loadMore) {
	if (this.data.loading) {
		return;
	}
	this.data.loading = true;
	var that = this;
	var limit = 10;
	var skip = loadMore?that.data.skip+1:1;
	let params = {
		data:{
			values:{
				status: 1,
				skip: skip,
				limit: limit
			}
		}
	}
	Model.getCasesList(params, (res) => {
		if (res && res.status == 0) {
			let items = res.data.items;
			that.data.haveMoreData = items.length == limit;
			if (loadMore) {
				that.data.caseList = that.data.caseList.concat(items);
			} else {
				that.data.caseList = items;
			}
			that.data.skip = skip;
		} else {
			that.data.haveMoreData = false;
		}
		that.data.loading = false;
		that.data.refresherTriggered = false;
	});
}
```

## scroll-view 滚动到指定元素

在”加盟代理“页面（pages/join/join.stml），最外层是一个 scroll-view，里面有分类列表、分类内容两项，点击分类列表里面某项后会自动滚动到对应的分类内容处，让分类内容可见。

```html
<scroll-view class="main" scroll-y scroll-into-view={viewId} scroll-with-animation enable-back-to-top refresher-enabled refresher-threshold="90" refresher-triggered={refresherTriggered} onrefresherrefresh={this.onrefresherrefresh}>
	<!-- 分类列表 -->
	<view class="cate">
		<view class="cate-item" v-for="(item,index) in list" data-id={item.id} onclick="onitemclick">
			<image src={item.image} class="cate-img"></image>
			<text class="cate-word">{item.title}</text>
		</view>
	</view>
	<!-- 分类内容 -->
	<view class="content">
		<view class="content-item" v-for="(item,index) in list" id={'content'+item.id}>
			<text class="content-title">{item.title}</text>
			<rich-text nodes={item.content} />
		</view>
	</view>
</scroll-view>
```

滚动到指定视图通过 scroll-view 的 scroll-into-view 属性实现，这里绑定了 viewId 属性，在分类列表项的点击事件 onitemclick 里面，改变 viewId 属性的值，这个值是分类内容里面某项的 id，这样就实现了滚动到指定视图。

```js
onitemclick(e) {
	var id = e.currentTarget.dataset.id;
	this.data.viewId = 'content' + id;
	this.data.viewId = null;
}
```

## 平台差异化处理

在多端开发中，难买会遇到不同平台差异化的地方，需要在运行期间做判断处理，为此在 utils/util.js 中封装了 isApp 方法，里面通过 api.platform 属性判断来当前运行环境。

```js
// util.js
isApp(){
   if (api.platform && api.platform == 'app') {
       return true;
   }
   return false;
}
```

例如在 pages/web/web.stml 中，我们使用 v-if、v-else 指令，通过区分平台使用不同的组件来加载 web 链接。

```stml
<view class="main">
	<frame v-if="$util.isApp()" class="web-view" name="web" url={api.pageParam.link}></frame>
	<web-view v-else class="web-view" src={api.pageParam.link}></web-view>
</view>
```
