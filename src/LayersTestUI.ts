class LayersTestUI extends LayersDisplayObjectContainer {
    private textfield: egret.TextField

    constructor() {
        super()
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this)
    }

    private onAddToStage() {
        console.log(this.stage.width, this.stage.height)
        console.log(this.stage.stageWidth, this.stage.stageHeight)
        this.init()
        /**
         * NOTE: 务必先调用
         */
        this.ensureBasicStyle(this.stage.stageWidth, this.stage.stageHeight, 0.7)
    }

    private init() {
        let sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        let topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        this.addChild(topMask);

        let icon = this.createBitmapByName("egret_icon_png");
        this.addChild(icon);
        icon.x = 26;
        icon.y = 33;

        let line = new egret.Shape();
        line.graphics.lineStyle(2, 0xffffff);
        line.graphics.moveTo(0, 0);
        line.graphics.lineTo(0, 117);
        line.graphics.endFill();
        line.x = 172;
        line.y = 61;
        this.addChild(line);


        let colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "Hello Egret";
        colorLabel.size = 24;
        colorLabel.x = 172;
        colorLabel.y = 80;
        this.addChild(colorLabel);

        /*** 关键应用代码 ***/
        let btn = new PureColorButton(200, 80, 52, '显示弹框', 0XFFFF00, 0XFF0000)
        this.addChild(btn)
        btn.x = this.width / 2 - btn.width / 2
        btn.y = this.height / 2 - btn.height / 2

        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            let layer = this.buildTestLayer()
            this.push(layer)
        }, this)

        // NOTE: emptyLayers 事件
        this.addEventListener('emptyLayers', function () {
            this.layerID = 0
        }, this)
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    private layerID: number

    private buildTestLayer(): Layer {
        if (!this.layerID) {
            this.layerID = 1
        } else {
            this.layerID++
        }

        /**
         * NOTE: new Layer 时务必传入 LayersDisplayObjectContainer 对象做为参数
         */
        let layer = new Layer(this)
        layer.width = 400
        layer.height = 560 + Math.round(Math.random() * 120)
        layer.graphics.beginFill(0x444444 * Math.ceil(Math.random() * 3))
        layer.graphics.drawRect(0, 0, layer.width, layer.height)
        layer.graphics.endFill()

        let title = new egret.TextField()
        title.text = `Layer ${this.layerID}`
        title.size = 36
        title.height = 100
        title.verticalAlign = egret.VerticalAlign.MIDDLE
        title.x = layer.width / 2 - title.width / 2
        layer.addChild(title)

        let btn1 = new PureColorButton(240, 70, 52, '推入新 Layer', 0X000000, 0XFFFFFF)
        layer.addChild(btn1)
        btn1.x = layer.width / 2 - btn1.width / 2
        btn1.y = title.height + 20
        btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            let layer = this.buildTestLayer()
            this.push(layer)
            // if (this.layerID >= 3) {
            //     this.setCloseBtnPos(400 + Math.round(Math.random() * 100), 800 + Math.round(Math.random() * 100))
            // }
        }, this)

        let btn2 = new PureColorButton(240, 70, 52, '关闭当前 Layer', 0X000000, 0XFFFFFF)
        layer.addChild(btn2)
        btn2.x = btn1.x
        btn2.y = btn1.height + btn1.y + 20
        btn2.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.pop()
        }, this)

        let btn3 = new PureColorButton(240, 70, 52, 'replace', 0X000000, 0XFFFFFF)
        layer.addChild(btn3)
        btn3.x = btn1.x
        btn3.y = btn2.height + btn2.y + 20
        btn3.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            let layer = this.buildTestLayer()
            this.replace(layer)
        }, this)

        let btn4 = new PureColorButton(240, 70, 52, 'replacePeak', 0X000000, 0XFFFFFF)
        layer.addChild(btn4)
        btn4.x = btn1.x
        btn4.y = btn3.height + btn3.y + 20
        btn4.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            let layer = this.buildTestLayer()
            this.replacePeak(layer)
        }, this)

        let btn5 = new PureColorButton(240, 70, 52, '清空 Layers', 0X000000, 0XFFFFFF)
        layer.addChild(btn5)
        btn5.x = btn1.x
        btn5.y = btn4.height + btn4.y + 20
        btn5.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.clear()
        }, this)

        return layer
    }
}
