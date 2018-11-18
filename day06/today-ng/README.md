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

## Antd布局

### 栅格

基于行列布局；每行划为24列；行定义为flex类型后，可以指定行内元素水平垂直如何对齐； 

### Layout

nz-layout：布局容器
nz-header：
nz-sider:
nz-content:
nz-footer:
