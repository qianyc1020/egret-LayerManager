class LayersDisplayObjectContainer extends egret.DisplayObjectContainer {
    private cover: egret.Shape
    private layerBox: egret.DisplayObjectContainer
    private closeBtn: egret.Sprite

    protected layers: Array<egret.DisplayObject>
    private closeBtnPosCache: {
        [propName: number]: egret.Point
    }

    private hasEnsureBasicStyle: boolean

    constructor() {
        super()
        this.cover = new egret.Shape()
        this.layerBox = new egret.DisplayObjectContainer()

        // 需要定制关闭按钮可编辑此处
        let closeBtn = new egret.Sprite()
        closeBtn.touchEnabled = true
        closeBtn.width = 40
        closeBtn.height = 40
        this.closeBtn = closeBtn
        closeBtn.graphics.lineStyle(6, 0xffffff)
        closeBtn.graphics.beginFill(0xffffff, 0)
        closeBtn.graphics.drawCircle(20, 20, 40)
        closeBtn.graphics.endFill()
        closeBtn.graphics.moveTo(10, 10)
        closeBtn.graphics.lineTo(30, 30)
        closeBtn.graphics.moveTo(30, 10)
        closeBtn.graphics.lineTo(10, 30)
        closeBtn.cacheAsBitmap = true

        this.layers = []
        this.closeBtnPosCache = {}

        this.cover.touchEnabled = true
        this.cover.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event) {
            // cover 阻截点击事件
            event.stopPropagation()
            event.stopImmediatePropagation()
        }, this)

        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event) {
            this.pop()
        }, this)
    }

    /**
     * @param width
     * @param height
     * @param alpha  遮罩的透明度
     */
    ensureBasicStyle(width: number, height: number, alpha?: number) {
        this.width = width
        this.height = height

        this.layerBox.width = width
        this.layerBox.height = height

        this.cover.graphics.beginFill(0x000000, alpha || 0.8)
        this.cover.graphics.drawRect(0, 0, width, height)
        this.cover.graphics.endFill()

        this.hasEnsureBasicStyle = true
    }

    /**
     * @param layer 待添加的弹窗显示对象
     * @returns this
     * 
     * 方法可能抛出的异常：
     *  Error   LayersDisplayObjectContainer 实例还未调用 ensureBasicStyle 进行初始化
     */
    push(layer: egret.DisplayObject): this {
        if (!this.hasEnsureBasicStyle) {
            throw new Error('LayersDisplayObjectContainer：请先调用 ensureBasicStyle 进行初始化')
        }

        let lastLayer = this.layers[this.layers.length - 1]

        this.layerBox.addChild(layer)
        this.layers.push(layer)

        if (lastLayer) {
            // 禁用被覆盖 Layer 的点击
            lastLayer.touchEnabled = false
            if (lastLayer instanceof egret.DisplayObjectContainer) {
                lastLayer.touchChildren = false
            }
            // 被覆盖层不可见
            lastLayer.visible = false
        }

        layer.visible = true
        layer.touchEnabled = true
        if (layer instanceof egret.DisplayObjectContainer) {
            layer.touchChildren = true
        }

        this.layoutLayer(layer)

        return this
    }

    pop() {
        if (!this.hasEnsureBasicStyle) {
            throw new Error('LayersDisplayObjectContainer：请先调用 ensureBasicStyle 进行初始化')
        }

        let layer = this.layers.pop()
        if (layer) {
            this.layerBox.removeChild(layer)
            delete this.closeBtnPosCache[this.layers.length]
            this.dispatchEvent(new egret.Event('popLayer', false, false, {
                layer: layer
            }))
        } else {
            return this
        }

        let peakLayer = this.layers[this.layers.length - 1]
        if (peakLayer) {
            // 恢复顶层 Layer 的点击
            peakLayer.touchEnabled = true
            if (peakLayer instanceof egret.DisplayObjectContainer) {
                peakLayer.touchChildren = true
            }
            // 重新显示
            peakLayer.visible = true
            this.layoutCloseBtn()
        } else {
            // 已经 pop 到空了
            this.emptyHandler()
        }

        return this
    }

    replacePeak(layer: egret.DisplayObject) {
        if (!this.hasEnsureBasicStyle) {
            throw new Error('LayersDisplayObjectContainer：请先调用 ensureBasicStyle 进行初始化')
        }
        let replaceLayer = this.layers.pop()

        if (!replaceLayer) {
            throw new Error('LayersDisplayObjectContainer：Layer 栈为空，无法替换')
        }

        this.layerBox.removeChild(replaceLayer)
        delete this.closeBtnPosCache[this.layers.length]

        this.layerBox.addChild(layer)
        this.layers.push(layer)

        layer.visible = true

        this.layoutLayer(layer)
        return this
    }

    replace(layer: egret.DisplayObject) {
        if (!this.hasEnsureBasicStyle) {
            throw new Error('LayersDisplayObjectContainer：请先调用 ensureBasicStyle 进行初始化')
        }

        this.layerBox.removeChildren()
        this.layers = []
        this.closeBtnPosCache = {}

        this.layerBox.addChild(layer)
        this.layers.push(layer)

        layer.visible = true

        this.layoutLayer(layer)
        return this
    }

    clear() {
        this.emptyHandler()
        return this
    }

    private layoutLayer(layer: egret.DisplayObject) {
        layer.anchorOffsetX = layer.width / 2
        layer.anchorOffsetY = layer.height / 2

        layer.x = this.width / 2
        layer.y = this.height / 2

        this.closeBtn.x = this.width / 2 - this.closeBtn.width / 2
        this.closeBtn.y = layer.y + layer.height / 2 + 50

        layer.scaleX = 0.5
        layer.scaleY = 0.5
        egret.Tween.get(layer).to({
            scaleX: 1,
            scaleY: 1
        }, 340, egret.Ease.backInOut)

        if (!this.cover.parent) {
            this.addChild(this.cover)
            this.addChild(this.layerBox)
            this.addChild(this.closeBtn)
        }
    }

    private layoutCloseBtn() {
        let index = this.layers.length - 1
        let layer = this.layers[index]
        if (this.closeBtnPosCache[index]) {
            this.closeBtn.x = this.closeBtnPosCache[index].x
            this.closeBtn.y = this.closeBtnPosCache[index].y
        } else {
            this.closeBtn.x = this.width / 2 - this.closeBtn.width / 2
            this.closeBtn.y = layer.y + layer.height / 2 + 50
        }
    }

    setLayoutLayerPos(layer: egret.DisplayObject, x: number, y: number) {
        x !== undefined && (layer.x = x)
        y !== undefined && (layer.y = y)
    }

    setCloseBtnPos(x: number, y: number) {
        x !== undefined && (this.closeBtn.x = x)
        y !== undefined && (this.closeBtn.y = y)

        this.closeBtnPosCache[this.layers.length - 1] = new egret.Point(x, y)
    }

    hideCloseBtn() {
        this.closeBtn.visible = false
    }

    showCloseBtn() {
        this.closeBtn.visible = true
    }

    private emptyHandler() {
        this.layerBox.removeChildren()
        this.layers = []
        this.closeBtnPosCache = {}

        if (this.cover.parent) {
            this.removeChild(this.cover)
            this.removeChild(this.layerBox)
            this.removeChild(this.closeBtn)

            this.dispatchEvent(new egret.Event('emptyLayers'))
        }
    }
}

class Layer extends egret.Sprite {
    protected mountTo: LayersDisplayObjectContainer

    constructor(mountTo: LayersDisplayObjectContainer) {
        super()
        // Layer 挂载到的 UI
        this.mountTo = mountTo
    }

}
