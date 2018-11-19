# TodayNg

## 创建项目

```sh
ng new today-ng         # 创建Angular项目
cd .\today-ng\
ng add ng-zorro-antd    # 添加Antd的引用
```

## 创建setup页面

```sh
ng g m pages/setup      # 创建setup模块，修改模块引入formsmodule和antd的module
ng g c pages/setup --module pages/setup # 创建setup页面组件
```

## 添加路由

```sh
ng generate module app-routing --flat --module=app  # 创建路由文件
```

修改app/app-routing.module.ts文件注册路由：
```ts
const routes: Routes = [
  { path: 'setup', component: SetupComponent },
  { path: '', redirectTo: '/setup', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
```

修改app.module.ts引入setup以及路由模块：
```ts
 imports: [
    ...
    AppRoutingModule,
    SetupModule
  ],
```

修改app.component.html加载路由组件：
```html
<router-outlet></router-outlet>
```

## 存储服务

```sh
ng g s services/local-storage --module app
```

修改代码实现get、set操作以及某些key的读取保存操作。  

通过分离存储服务可以实现：
1. 多个模块使用同一个存储服务。
2. 可以随时替换为不同的存储方式。

## 实现setup页面

修改组件代码：setup.component.ts
```ts
export class SetupComponent implements OnInit {
  username: string;     // 声明变量，以便在页面中绑定

  constructor(private store: LocalStorageService) { }  // 通过依赖注入存储服务

  ngOnInit() {
  }

  // 当点击保存按钮时调用的函数
  saveSettings(): void {
    this.store.setInited();
    this.store.setStartDate();
    this.store.setUsername(this.username);
  }
}
```

修改组件页面：一个输入框，绑定变量；一个按钮，绑定事件。

```html
<div>
  <input nz-input placeholder="请输入用户名" #usernameInput [(ngModel)]="username">
  <button nz-button nzType="primary" (click)="saveSettings()" [disabled]="!usernameInput.value">保存</button>
</div>
```

## CSS相关的一些知识

### 块级元素与行级元素

1. 块级元素：
    * 独占一行，其后的元素只能另起一行；高度、宽度、行高和顶底边距都可以设置（宽多默认为父元素的宽度）。
    * 常见块级元素：`<div>、<form>、<canvas>、<hr>、<p>、<video>、<ol>、<ul>、<h1-6>、<table>`等。
2. 行内元素：
    * 可以和其它元素一行；高度、宽度、边距都不可以设置；宽度就是包含的内容的宽度。
    * 常见行内元素：`<button>、<input>、<label>、<select>、<span>、<a>、<br>、<img>`等。
3. 互相转换："display:inline"可以将块级转为行内；"display:block"可以将行级转为块级。
4. 行内块级元素：想元素处于一行，并且又能设置高度、宽度、行高以及边距，那么设置为"display:inline-block"。
5. 当弹性布局时表现不一样，自己的验证就是`<div>`也变成了行内元素。

### 弹性布局

弹性布局：通过给父元素设置"display:flex"，子元素就可以进行弹性布局了。如果要设置行内元素为flex容器，那么设置"display:inline-flex"。
    * 可以通过设置"flex-direction"属性决定是一行行排列还是一列列排列。
    * 可以通过"flex"属性指定元素的最小宽度。
    * 可以通过"flex-wrap"属性指定超出宽度时如何处理。

#### 术语

* 主轴：横轴。
* 交叉轴：竖轴。
* flex容器：设置了"display:flex"的元素。
* flex项：flex中的子项。

#### flex属性

* 在flex项上设置无单位的数字代表元素所占的比例。比如"flex:2"的元素就是"flex:1"的元素的2倍宽度，但具体是一行的多少就要看这一行放多少元素了。
* 带有单位的数字代表元素最小宽度。比如"flex:200px"表示元素最小宽度为200像素。还可以连用："flex: 1 200px"，表示占用1，但是最小宽度至少200px。

#### 水平和垂直对齐

* 垂直方向：
    * 通过flex容器的"align-items"属性控制。"center"就是居中对齐；默认值是"stretch"，本行内所有的元素都被拉伸到同样高度（等于最大高度元素的高度值）。
    * 通过flex项的"align-self"属性单独控制本元素垂直方向的对齐行为。比如"flex-start"就是顶部；"flex-end"就是底部；"center"就是中间。
* 水平方向：
    * 通过flex容器的"justify-content"属性控制。"flex-start、flex-end、center"类似。"space-aroud"是均匀分布，并且两头留点空白；"space-between"均匀分布，两头不留空白。

#### 排序

通过“order"属性可以设置flex项的顺序，越小越靠前。

## Antd布局

### 栅格

基于行列布局；每行划为24列；行定义为flex类型后，可以指定行内元素水平垂直如何对齐； 

### Layout

nz-layout：布局容器
nz-header：
nz-sider:
nz-content:
nz-footer:
