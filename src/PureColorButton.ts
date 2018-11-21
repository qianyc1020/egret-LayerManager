class PureColorButton extends egret.DisplayObjectContainer {
    private btnBox: egret.Shape
    private label: egret.TextField
    private roundValue: number

    constructor(width: number, height: number, roundValue: number, str: string, btnColor: number, labelColor?: number) {
        super()
        this.width = width
        this.height = height
        this.roundValue = roundValue
        this.touchEnabled = true

        let btnBox = new egret.Shape()
        this.addChild(btnBox)
        this.btnBox = btnBox
        btnBox.graphics.beginFill(btnColor)
        btnBox.graphics.drawRoundRect(0, 0, this.width, this.height, roundValue, roundValue)
        btnBox.graphics.endFill()

        let label = new egret.TextField()
        this.addChild(label)
        this.label = label
        label.text = str
        labelColor && (label.textColor = labelColor)
        label.size = 28
        label.height = this.height
        label.width = this.width
        label.verticalAlign = egret.VerticalAlign.MIDDLE
        label.textAlign = egret.HorizontalAlign.CENTER
    }

    disable() {
        this.touchEnabled = false
    }

    updateBoxColor(newColor: number) {
        this.btnBox.graphics.clear()
        this.btnBox.graphics.beginFill(newColor)
        this.btnBox.graphics.drawRoundRect(0, 0, this.width, this.height, this.roundValue, this.roundValue)
        this.btnBox.graphics.endFill()
    }

    opacity(alpha: number) {
        this.btnBox.alpha = alpha
    }

    updateLabelCnt(val: string) {
        this.label.text = val
    }
}
