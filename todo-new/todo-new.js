var log = function(){console.log.apply(console,arguments)}
//声明分类，子分类，项目的数组，以下面的格式：

// [{"id":0,"name":"默认分类","child":[0]},
// {"id":1,"name":"父亲一","child":[1,2]},
// {"id":2,"name":"父亲二","child":[3,4]}]
//
// [{"id":0,"pid":0,"name":"默认子分类","child":[-1,0,1]},
// {"id":1,"pid":"1","name":"父一子一","child":[2,3]},
// {"id":2,"pid":"1","name":"父一子二","child":[4]},
// {"id":3,"pid":"2","name":"父二子一","child":[5]},
// {"id":4,"pid":"2","name":"父二子二","child":[6]}]
//
// [{"finish":true,"name":"使用说明","date":"2015-06-05","content":"本应用为离线应用","pid":0,"id":-1,},
// {"finish":true,"name":"sssss","date":"2016-11-17","content":"sssss","pid":"0","id":0},
// {"finish":true,"name":"uuuuu","date":"2016-11-10","content":"uuuuuuuuuu","pid":"0","id":1},
// {"finish":false,"name":"111111111","date":"2016-11-02","content":"张聪聪错错错错错错错错","pid":1,"id":2},
// {"finish":false,"name":"222222222222","date":"2016-11-17","content":"分分分分分","pid":"1","id":3},
// {"finish":false,"name":"111111111111","date":"2016-11-05","content":"扥纷纷纷纷","pid":"2","id":4},
// {"finish":false,"name":"111111111111","date":"2016-11-11","content":"分分分分分分分","pid":"3","id":5},
// {"finish":false,"name":"1111111111111","date":"2016-11-17","content":"谢谢谢谢谢谢谢","pid":"4","id":6}]

var todo = {
    parentList : [
        {id: 0,name: '默认分类', child: [0]},
    ],
    childList : [
        {id: 0, pid: 0, name: '默认子分类', child: [0]}
    ],
    taskList : [
        {id: 0, pid: 0, name: '使用说明', content: '本应用是离线应用，数据将存储在本地硬盘',date:'2016-11-09', finish: true,}
    ],
}

//选择器
var $ = function(element) {
    if(element){
        return document.querySelector(element)
    }
    else {
        log( id + "is not exit")
    }
}
//对元素注册事件
var addEvent = function(element, event, listener) {
    if(element.addEventListener){
        element.addEventListener(event, listener);
    } else {
        log('failed to add event')
    }
}
//通过id在数组中寻找拥有此id的对象（不能直接把id当index，因为数据有可能存放在数据库里面，而id并不是一个人
//的，有可能是多个人共用，此时id就按照顺序排列。）
//以上是我开始的想法，后来想想，其实id就是每个在数组中的index值，这个无所谓有多少，放进去的时候就决定了
//他的位置，也就决定了index值，但是还是按照搜索id的方式写吧
var findById = function(id, list) {
    var found = false
    for (let i = 0; i < list.length; i++) {
        if (String(id) === String(list[i].id)) {
            return list[i]
        }
    }
    return found
}

//绑定添加分类菜单的事件的按钮
var addParentBind = function() {
    $('.nav-btm').addEventListener('click', function(e){
        $('.cover').style.display = 'block'
    })
    addEvent($('#cancel'), 'click', function(){
        $('.cover').style.display = 'none'
    })
    addEvent($('#ok'), 'click', function(){
        var selValue = $('#add-select').value
        var inputValue = $('#add-input').value
        $('#add-input').value = ''
        if (!inputValue) {
            alert('请输入分类名称')
        } else {
            addParentData(selValue, inputValue)
            // log(selValue, inputValue)
            $('.cover').style.display = 'none'
        }
    })
}
//添加分类的事件，并将数据存入全局变量（这里模拟后端数据）
var addParentData = function(selValue, inputValue) {
    //如果这是第一个，就增加主分类
    var selNUm = Number(selValue)
    log(selNUm)
    if (selNUm === 0) {
        var newId = todo.parentList.length
        var newParent = {id: newId,name: inputValue,child:[]}
        //把新加入的父类导入parentList，注意，这里为了要模拟后端交互，用parentList里面的
        //数据进行前端页面的修改，假设后端返回的是newParent
        todo.parentList.push(newParent)
        addParentFront(newParent)
    } else {
        var newId = todo.childList.length
        var newChild = {id: newId, pid: selNUm, name: inputValue, child: []}
        todo.childList.push(newChild)
        //同样，这里不能把pid当做index直接修改，应该根据id找到parentList里面相应对象，再修改这个对象
        var pCell = findById(selNUm, todo.parentList)
        pCell.child.push(newId)
        addChildFront(newChild)
    }
}
//添加父类，根据模拟后端返回的数据进行前端页面的更新
var addParentFront = function(newParent) {
    //添加父类页面的HTML部分
    var t = `<div class="todo-item" data-idofitem=${newParent.id}>
        <div class="todo-item-title">
            ${newParent.name}(<span>0</span>)
        </div>
    </div>`
    $('.todo-item-container').insertAdjacentHTML('beforeend', t)
    //添加分类选择框HTML部分
    var s = `<option value=${newParent.id}>${newParent.name}</option>`
    $('#add-select').insertAdjacentHTML('beforeend', s)
}
//添加子分类，根据模拟后端返回的数据进行前端页面的更新
var addChildFront = function(newChild) {
    //子分类的模板字符串
    var t = `<div class="todo-item-child" data-idofchild=${newChild.id}>
                ${newChild.name}(<span>0</span>)
            </div>`
    var id = newChild.pid
    //寻找id为pid的目标父元素pa,插入目标字符串,并修改父元素标题中的子分类个数
    var pa = $(`[data-idofitem="${id}"]`)
    pa.insertAdjacentHTML('beforeend', t)
    var paSpan = pa.getElementsByClassName('todo-item-title')[0].getElementsByTagName('span')[0]
    paSpan.innerHTML = Number(paSpan.innerHTML) + 1
}
//点击nav内的元素时。修改container中的被激活的元素的data-activeChild，以方便识别在哪个子分类
//添加任务以及改变任务显示
var navActiveBind = function() {
    //选择所有子分类
    var children = $('.todo-item-container').getElementsByClassName('todo-item-child')
    //给container绑定点击事件
    addEvent($('.todo-item-container'), 'click', function(e){
        var self = e.target
        if (self.classList.contains('todo-item-child')) {
            //如果是子分类，就删去其他元素的激活class，给这个加上class，并修改container中的data
            //先删去所有激活class
            Array.prototype.forEach.call(children, function(t){
                if (t.classList.contains('child-active')) {
                    t.classList.remove('child-active')
                }
            })
            //再给自己加上
            self.classList.add('child-active')
            //获取目标的id
            var cid = self.dataset.idofchild
            //这个作为激活的id赋予container的data
            $('.todo-item-container').setAttribute('data-activechild',cid)
            //根据选取的id，即activechild的id，更新aside界面
            rendAside()
            //根据渲染后的aside中的任务列表，更新渲染main界面
            rendMain()
        }
    })
}
//根据选取的activechild的id，更新渲染aside界面，即把childList中的child数组中的元素列出来
var rendAside = function() {
    //获取目前激活的child的id，并根据此id在childList里面找到这个child，并获取其child数组，即
    //包含task的id的数组
    var cid = $('.todo-item-container').dataset.activechild
    var activechild = findById(cid, todo.childList)
    var taskArray = activechild.child
    // 清空任务列表的内容，并根据选择的内容替换
    $('.todo-task-list').innerHTML = ''
    if (taskArray.length > 0) {
        Array.prototype.forEach.call(taskArray, function(t){
            var task = findById(t, todo.taskList)
            // 将获取的每个task显示在列表中
            var id = task.id
            var name = task.name
            var date = task.date
            var finish = task.finish
            var t = `<div class="todo-task-list-time todo-task-list-cell">${date}</div>
                    <div class="todo-task-list-content todo-task-list-cell" data-idoftask=${id}>${name}</div>`
            $('.todo-task-list').insertAdjacentHTML('beforeend', t)
        })
        //把所选的task中的第一个职位置为激活的，data-activetask
        var task1 = $('.todo-task-list').getElementsByClassName('todo-task-list-content')[0]
        $('.todo-task-list').dataset.activetask = task1.dataset.idoftask
        // //给aside绑定事件
        // asideActiveBind() 注意这里不用每次绑定，在父元素绑定一次就好，所以放到外面运行
    } else {
        $('.todo-task-list').dataset.activetask = -1   //代表task列表没有内容
    }
}
//同nav，点击aside内的元素时。修改task-list中的被激活的元素的activetask，以方便识别在哪个子分类
//添加任务以及改变任务显示
var asideActiveBind = function() {
    var children = $('.todo-task-list').getElementsByClassName('todo-task-list-content')
    addEvent($('.todo-task-list'), 'click', function(e){
        var self = e.target
        if (self.classList.contains('todo-task-list-content')) {
            Array.prototype.forEach.call(children, function(t){
                if (t.classList.contains('task-active')) {
                    t.classList.remove('task-active')
                }
            })
            self.classList.add('task-active')
            var tid = self.dataset.idoftask
            $('.todo-task-list').setAttribute('data-activetask',tid)
            rendMain()
        }
    })
}
//根据选取的activetask的id，更新渲染main界面
var rendMain = function() {
    var tid = $('.todo-task-list').dataset.activetask
    //把textarea改为不可编辑，并隐藏按钮
    $(`.textarea-content`).readonly = 'readonly'
    $(`.textarea-content`).disabled = 'disabled'
    $('.todo-saveAndQuit').style.display = 'none'
    //根据id进行渲染
    if(Number(tid) !== -1) {
        var task = findById(tid, todo.taskList)
        //根据task更新渲染main
        var name = task.name
        var date = task.date
        var content = task.content
        log(content)
        rendMainAid(name, date, content)
    } else {
        rendMainAid('无', '无', '无内容')
    }
}
//渲染main辅助函数
var rendMainAid = function(name, date, content) {
    $('.todo-title').innerHTML = name
    $('.todo-time').getElementsByTagName('span')[0].innerHTML = date
    $('.todo-content').querySelector('.textarea-content').value = content
}
//添加新增任务按钮事件
var addTaskBind = function() {
    addEvent($('.aside-btm'), 'click', function(e){
        var tInput = `<input type="text" placeholder="请输入标题" class='todo-name-input'>`
        var dInput = `<input type="date" class='todo-date-input'>`
        // var button =
        rendMainAid(tInput, dInput, '')
        //将textarea改为可编辑
        $(`.textarea-content`).removeAttribute('readonly')
        $(`.textarea-content`).removeAttribute('disabled')
        //显示按钮
        $('.todo-saveAndQuit').style.display = 'block'
    })
}
//绑定保存和取消事件
var saveTaskBind = function() {
    addEvent($('.todo-saveAndQuit'), 'click', function(e){
        var self = e.target
        if (self.classList.contains('quit')) {
            rendMain()
        } else if (self.classList.contains('save')) {
            var name = $('.todo-name-input').value
            var date = $('.todo-date-input').value
            var content = $('.textarea-content').value


        }
    })

}




var __main = function() {
    addParentBind()
    navActiveBind()
    asideActiveBind()
    addTaskBind()
    saveTaskBind()
}

__main()
