var log = function() {console.log.apply(console, arguments)}
//建立对象
var sliderDiv = function(width, height, diameter, maxValue, Currentvalue, position) {
    this.height = height,
    this.width = width,
    this.maxValue = maxValue,
    this.diameter = diameter,
    this.Currentvalue = Currentvalue,
    this.position = $(position),
    this.callbackSlider
    // this.outHandle = '#outer-slider'
}
//计算outer-slider的真实长度
sliderDiv.prototype.realWidth = function() {
    var value
    if (this.width.includes('px')) {
        value = Number(this.width.replace('px',''))
    } else if (this.width.includes('%')) {
        var parent = Number(this.position.css('width').replace('px',''))
        value = parent * Number(this.width.replace('%','')) /100
    }
    return value
}
//初始化HTML代码
sliderDiv.prototype.initSlider = function() {
    var realWid = this.realWidth()
    log(this.Currentvalue / this.maxValue)
    var t = `<div id="outer-slider">
                    <div id="inner-slider">
                        <div id="dot-slider"></div>
                    </div>
                </div>`
    var c = `<style>
        #outer-slider {
            display: inline-block;
            background: grey;
            width: ${this.width};
            height: ${this.height}px;
            border-radius: 25px;
            v
        }
        #inner-slider {
            position: relative;
            background: red;
            width: ${this.Currentvalue / this.maxValue * 100}%;
            height: ${this.height}px;
            border-radius: 25px;
        }
        #dot-slider {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translate(50%,-50%);
            width: ${this.diameter}px;
            height: ${this.diameter}px;
            background: white;
            border-radius: 50%;
        }
        #dot-slider:hover {
            cursor: pointer;
        }
    </style>`
    this.position.append(t)
    $('head').prepend(c)
}

//根据视图X坐标获取slider内的相对X坐标,并改变滑块位置和value
sliderDiv.prototype.locXInSlider = function(x) {
    var offsetLeft = $('#outer-slider')[0].offsetLeft
    var locAlt = x - offsetLeft
    var realWid = this.realWidth()
        // log(locAlt, realWid)
    if (locAlt < realWid && locAlt > 0) {
        // var widPercent = locAlt /
        $('#inner-slider').css('width', locAlt)
        //上面这行代码的作用等于下面这四行。。。
        // var sheet =document.styleSheets[0]
        // var rules = sheet.cssRules || sheet.rules
        // var rule = rules[2]
        // rule.style.width = locInDiv + 'px'
        var value = locAlt / realWid * this.maxValue
        this.Currentvalue = value
        // log(this.Currentvalue)
    }
    // return locAlt
}
//根据value改变滑块位置
sliderDiv.prototype.sliderByValue = function(x) {
    var realWid = this.realWidth()
    var CurrentWidth = this.Currentvalue / this.maxValue * realWid
    // log( CurrentWidth)
    $('#inner-slider').css('width', CurrentWidth)
}
//给slider绑定点击使滑块移动的事件
sliderDiv.prototype.bindSlider = function() {
    $('#outer-slider').on('mousedown', function(e){
        var clientX = e.clientX
        this.locXInSlider(clientX)
        this.callbackSlider()
    }.bind(this))                 //这里用bind方法将外层的this指针传入内层
}
//给滑块绑定拖动事件
sliderDiv.prototype.bindDot = function() {
    $('#dot-slider').on('mousedown', function(){
        //注意，body的大小和里面的内容有关，如果光在body里面添加一个slider，这时候
        //body的宽度是浏览器界面的宽度，但是长度就只有slider的高度，所以无法实现以下
        //效果
        $('body').on('mousemove', function(e){
            var clientX = e.clientX
            this.locXInSlider(clientX)
            this.callbackSlider()
        }.bind(this))
    }.bind(this))
}
//绑定松开鼠标取消拖动事件
sliderDiv.prototype.bindUp = function() {
    $('body').on('mouseup', function(e){
        $('body').off('mousemove')
    })
}
//主函数
sliderDiv.prototype.createSlider = function() {
    this.initSlider()
    this.bindSlider()
    this.bindDot()
    this.bindUp()
    this.sliderByValue()
}
// //声明实例
// var slider = new sliderDiv('80%', 5, 15, 100, 20, '.container')
// slider.createSlider()
