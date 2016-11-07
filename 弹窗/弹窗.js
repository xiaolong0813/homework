// 2016/10/14
//
// ============
// 作业 13
//
//
// 本次作业如果做不出来, 可以大家一起讨论一下
// ============
//
// //导入jQuery
// var loadjQuer = function() {
//     var t = `<script src="http://cdn.bootcss.com/jquery/3.1.1/jquery.js"></script>`
//     var head = document.querySelector('head')
//     head.insertAdjacentHTML('beforeend', t)
// }
var log = function() {
    console.log.apply(console, arguments)
}
// 作业 1
//
// 实现一个 GuaAlert 函数, 如下
//弹窗模板字符串
var windowTemplate = function(title, message) {
    var t = `<div class="modal-container modal-remove">
                <div class="modal-mask"></div>
                    <div class="modal-alert vertical-center">
                    <div class="modal-title">
                        ${title}
                    </div>
                    <div class="modal-message">
                        ${message}
                    </div>
                    <div class="modal-control">
                        <button type="button" name="button" class="modal-button">OK</button>
                    </div>
                </div>
            </div>`
            return t
}
//css模板字符串
var cssTemplate = function() {
    var t = `<style class='modal-remove'>
                .modal-container {
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    top:0;
                    left:0;
                }
                .modal-mask {
                    position: fixed;
                    opacity: 0.5;
                    width: 100%;
                    height: 100%;
                    background-color: black;
                    top:0;
                    left:0;
                }
                .modal-alert {
                    margin: 0 auto;
                    width: 200px;
                    background-color:white;
                }
                .modal-title {
                    height: 20px;
                    text-align: center;
                    font-size: 18px;
                    background: lightblue;
                }
                .modal-message {
                    // text-align: center;
                    font-size: 20px;
                    background: lightgrey;
                    padding: 10px 5px;
                }
                .modal-button {
                    width: 100%;
                    height: 100%;
                    font-size: 15px;
                }
                .vertical-center {
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                }
            </style>`
            return t
}
//创建弹窗
var GuaAlert = function(title, message) {
    /*
    title 是 string
    message 是 string

    这个函数生成一个上课所说的弹窗插入页面
    弹窗包含 title 作为标题 和 message 作为信息
    还包含一个 OK 按钮
    点击 OK 按钮关闭弹窗
    */
    var w = windowTemplate(title, message)
    // log(w)
    var c = cssTemplate()
    $('body').append(w)
    $('head').append(c)
    var close = $('.modal-button')
    close.on('click', function(event){
        // $('.windowDiv').remove()
        // $('head').find('style').remove()
        //可以直接给style和div加上相同的class
        $('.modal-remove').remove()
    })
}


// 作业 2
//
//弹窗模板字符串
var windowTemplate2 = function(title, message) {
    var t = `<div class="modal-container modal-remove">
                <div class="modal-mask"></div>
                    <div class="modal-alert vertical-center">
                    <div class="modal-title">${title}</div>
                    <div class="modal-message">
                        ${message}
                    </div>
                    <div class="modal-control">
                        <button class="modal-button" type="button" name="button" data-type="cancel">Cancel</button>
                        <button class="modal-button" type="button" name="button" data-type="ok">OK</button>
                    </div>
                </div>
            </div>`
            return t
}
//css模板字符串
var cssTemplate2 = function() {
    var t = `<style class='modal-remove'>
                .modal-container {
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    top:0;
                    left:0;
                }
                .modal-mask {
                    position: fixed;
                    opacity: 0.5;
                    width: 100%;
                    height: 100%;
                    background-color: black;
                    top:0;
                    left:0;
                }
                .modal-alert {
                    margin: 0 auto;
                    width: 200px;
                    background-color:white;
                }
                .modal-title {
                    height: 20px;
                    text-align: center;
                    font-size: 18px;
                    background: lightblue;
                }
                .modal-message {
                    // text-align: center;
                    font-size: 20px;
                    background: lightgrey;
                    padding: 10px 5px;
                }
                .modal-control {
                    font-size: 0px;
                }
                .modal-button {
                    width: 50%;
                    height: 100%;
                    font-size: 15px;
                }
                .vertical-center {
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                }
            </style>`
            return t
}
var callback2 = function(a) {
    if (a) {
        log('true')
    } else if (!a) {
        log('false')
    }
    // log('a')
}
//弹窗
var GuaAlert2 = function(title, message, callback) {
    /*
    title 是 string
    message 是 string
    callback 是一个接受一个 bool 类型参数的函数

    这个函数生成一个上课所说的弹窗插入页面
    弹窗包含 title 作为标题 和 message 作为信息
    还包含一个 OK 按钮 和一个 Cancel 按钮
    点击 OK 按钮关闭弹窗, 调用 callback(true)
    点击 Cancel 按钮关闭弹窗, 调用 callback(false)
    */
    var w = windowTemplate2(title, message)
    var c = cssTemplate2()
    $('body').append(w)
    $('head').append(c)
    $('.modal-control').on('click', function(event){
        var self = $(event.target)
        // self.closest('.windowDiv').remove()
        // $('head').find('style').remove()
        // log('call')
        var type = self.data('type')
        if (type === 'cancel') {
            callback2(false)
        } else {
            callback2(true)
        }
        $('.modal-remove').remove()
    })
    // $('.modal-control').on('click', '.modal-button-cancel', function(event){
    //     // var self = $(event.target)
    //     // self.closest('.windowDiv').remove()
    //     // $('head').find('style').remove()
    //     $('.modal-remove').remove()
    //     callback(false)
    // })
}


// 作业 3
//

//弹窗模板字符串
var windowTemplate3 = function(title) {
    var t = `<div class="modal-container modal-remove">
                <div class="modal-mask"></div>
                    <div class="modal-alert vertical-center">
                    <div class="modal-title">${title}</div>
                    <div class="modal-message">
                        <input type="text" name="name" value="" class="modal-input">
                    </div>
                    <div class="modal-control">
                        <button class="modal-button" type="button" name="button" data-type="cancel">Cancel</button>
                        <button class="modal-button" type="button" name="button" data-type="ok">OK</button>
                    </div>
                </div>
            </div>`
            return t
}
//css模板字符串
var cssTemplate3 = function() {
    var t = `<style class='modal-remove'>
                .modal-container {
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    top:0;
                    left:0;
                }
                .modal-mask {
                    position: fixed;
                    opacity: 0.5;
                    width: 100%;
                    height: 100%;
                    background-color: black;
                    top:0;
                    left:0;
                }
                .modal-alert {
                    margin: 0 auto;
                    width: 200px;
                    background-color:white;
                }
                .modal-title {
                    height: 20px;
                    text-align: center;
                    font-size: 18px;
                    background: lightblue;
                }
                .modal-message {
                    // text-align: center;
                    // font-size: 20px;
                    background: lightgrey;
                    padding: 10px 5px 10px 5px;
                }
                .modal-input {
                    width: 100%;
                }
                .modal-control {
                    font-size: 0px;
                }
                .modal-button {
                    width: 50%;
                    height: 100%;
                    font-size: 15px;
                }
                .vertical-center {
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                }
            </style>`
            return t
}
var callback3 = function(a, value) {
    if (a) {
        log('true', value)
    } else if (!a) {
        log('false')
    }
    // log('a')
}
var GuaPrompt = function(title, callback) {
    /*
    title 是 string
    callback 是一个如下的函数
    function(clickOk, input) {
        // clickOk 是一个 bool 表明点击的是 OK 还是 Cancel
        // input 是 string
    }

    这个函数生成一个上课所说的弹窗插入页面
    弹窗包含 title 作为标题
    包含一个 input 让用户输入信息
    还包含一个 OK 按钮 和一个 Cancel 按钮
    点击 OK 按钮关闭弹窗, 调用 callback(true, 输入的内容)
    点击 Cancel 按钮关闭弹窗, 调用 callback(false)
    */
    var w = windowTemplate3(title)
    var c = cssTemplate3()
    $('body').append(w)
    $('head').append(c)
    $('.modal-control').on('click', function(event){
        var self = $(event.target)
        // self.closest('.windowDiv').remove()
        // $('head').find('style').remove()
        // log('call')
        var type = self.data('type')
        if (type === 'cancel') {
            callback3(false)
        } else {
            var value = $('.modal-input').val()
            callback3(true, value)
        }
        $('.modal-remove').remove()
    })
}


// 作业 4
//
//弹窗模板字符串
var windowTemplate4 = function(title, actionButtons) {
    var t = `<div class="modal-container modal-remove">
                <div class="modal-mask"></div>
                    <div class="modal-alert vertical-center">
                    <div class="modal-title">${title}</div>
                    <div class="modal-message">
                        ${actionButtons}
                    </div>
                    <div class="modal-control">
                        <button class="modal-action-button" type="button" name="button" data-index=-1>Cancel</button>
                    </div>
                </div>
            </div>`
            return t
}
//css模板字符串
var cssTemplate4 = function() {
    var t = `<style class='modal-remove'>
                .modal-container {
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    top:0;
                    left:0;
                }
                .modal-mask {
                    position: fixed;
                    opacity: 0.5;
                    width: 100%;
                    height: 100%;
                    background-color: black;
                    top:0;
                    left:0;
                }
                .modal-alert {
                    margin: 0 auto;
                    width: 200px;
                    background-color:white;
                }
                .modal-title {
                    height: 20px;
                    text-align: center;
                    font-size: 18px;
                    background: lightblue;
                }
                .modal-message {
                    // text-align: center;
                    // font-size: 20px;
                    background: lightgrey;
                    padding: 10px 5px 10px 5px;
                }
                .modal-input {
                    width: 100%;
                }
                .modal-control {
                    font-size: 0px;
                }
                .modal-action-button {
                    width: 100%;
                }
                .vertical-center {
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                }
            </style>`
            return t
}
var callback4 = function(index) {
        log(index)
}

var buttonTemplate = function(title, index) {
    var t = `
        <button class='modal-action-button' data-index="${index}">${title}</button>
    `
    return t
}

var GuaActions = function(title, actions, callback) {
    /*
    title 是 string
    actions 是一个包含 string 的数组
    callback 是一个如下的函数
    function(index) {
        // index 是下标, 具体如下
        // index 如果是 -1 表明用户点击了 cancel
    }

    这个函数生成一个弹窗页面
    弹窗包含 title 作为标题
    actions 里面的 string 作为标题生成按钮
    弹窗还包含一个 Cancel 按钮
    点击按钮的时候, 调用 callback(index)
    */
    var buttons = []
    for (var i = 0; i < actions.length; i++) {
        var value = actions[i]
        var b = buttonTemplate(value, i)
        buttons.push(b)
    }
    var actionButtons = buttons.join(' ')
    var w = windowTemplate4(title, actionButtons)
    var c = cssTemplate4()
    $('body').append(w)
    $('head').append(c)

    $('.modal-action-button').on('click', function(event){
        var self = $(event.target)
        var value = self.val()
        var index = self.data('index')
        callback4(index)
        $('.modal-remove').remove()
    })
}
