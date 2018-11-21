# 白鹭引擎 LayerManager 解决方案
复杂的游戏中常常一个场景有多个 Layer，并且可能一个 Layer 的操作会派生一个新 Layer。按照一定的规则来统一管理这些 Layer 能降低游戏的复杂度，提升开发的效率。

## 功能展示
<p align="center">
  <img width="320" src="./screenshot.gif"/>
</p>

## 类型指引
```typescript
declear class LayersDisplayObjectContainer extends egret.DisplayObjectContainer {
    protected layers: Array<egret.DisplayObject>

    /**
     * 务必在使用功能前调用此接口定义好基本样式
     * @param width
     * @param height
     * @param alpha  遮罩的透明度
     */
    ensureBasicStyle(width: number, height: number, alpha?: number): void

    /**
     * 增加一层 Layer
     * @param layer 待添加的弹窗显示对象
     * @returns this
     * 
     * 方法可能抛出的异常：
     *   Error   LayersDisplayObjectContainer 实例还未调用 ensureBasicStyle 进行初始化
     */
    push(layer: egret.DisplayObject): this

    /**
     * 移除顶层 Layer 
     * 
     * 方法可能抛出的异常：
     *   Error   LayersDisplayObjectContainer 实例还未调用 ensureBasicStyle 进行初始化
     */
    pop(): void

    /**
     * 用一个 Layer 来替换顶层 Layer
     * 
     * 方法可能抛出的异常：
     *   Error   LayersDisplayObjectContainer 实例还未调用 ensureBasicStyle 进行初始化
     */
    replace(layer: egret.DisplayObject): void

    /**
     * 清除所有 Layer
     */
    clear(): void

    /**
     * 自定义 Layer 的位置（否则默认居中显示）
     * @param layer 
     * @param x
     * @param y
     */
    setLayoutLayerPos(layer: egret.DisplayObject, x: number, y: number): void

    /**
     * 自定义关闭按钮的位置（否则默认紧挨 Layer 下端显示）
     * @param x
     * @param y
     */
    setCloseBtnPos(x: number, y: number): void

    /**
     * 隐藏关闭按钮
     */
    hideCloseBtn(): void

    /**
     * 显示关闭按钮
     */
    showCloseBtn(): void
}

declear class Layer extends egret.Sprite {
    /**
     * @param mountTo Layer 挂载的目标 LayersDisplayObjectContainer
     */
    constructor(mountTo: LayersDisplayObjectContainer)
}
```

## 相关链接

* [场景管理 - SceneManager](https://gist.github.com/yangfch3/30ba6b05e9f1f015a9c82aa10077dda0)
* [音频管理 - SoundManager](https://gist.github.com/yangfch3/c00c3b14cd54937a878b5f5e0cdbc4f9)
* [pomelo 客户端小程序/小游戏版: pomelo-client-wx](https://github.com/yangfch3/pomelo-client-wx)
