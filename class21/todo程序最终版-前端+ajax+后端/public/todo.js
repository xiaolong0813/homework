
///////////////////////////////////////////
var log = function() {console.log.apply(console, arguments)}
/////////////////////////////////////ajaxAPI 各种ajax的函数////////////////////////////////
//todoList用来存储服务器读取的全部任务
// var todoList = []
//所有url
var TodoApi = function(){
    this.all = '/todo/all',
    this.add = '/todo/add',
    this.update = '/todo/update/',
    this.del = '/todo/delete/'
}
//AJAX程序
TodoApi.prototype.ajax = function(request) {
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.method === 'POST') {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function(event) {
        if (r.readyState === 4) {
            request.callback(r.response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}
//请求内容
TodoApi.prototype.request = function(method, url, callback, str='', id='') {
    var account = {
        id: id,
        task: str
    }
    var data = JSON.stringify(account)
    var r = {
        method: method,
        url: url,
        contentType: 'application/json',
        data: data,
        callback: callback
    }
    return r
}
//获取所有todo
TodoApi.prototype.getAll = function() {
        this.ajax(this.request('GET',this.all,callGet))
}
//添加一个todo到服务器
TodoApi.prototype.addTodo = function(value, callAdd) {
        this.ajax(this.request('POST',this.add,callAdd,value))
}
//在服务器根据id删除一个todo,这里用url+请求字符串?id=id的方式传送id数据，用query的
//方式可获取查询部分，这里就可以用get方法。注意后端接受也应该用get方法。
TodoApi.prototype.delTodo = function(id) {
        this.ajax(this.request('GET',this.del + `?id=${id}`,callDel))
}
// //清空后台数据
// TodoApi.prototype.clearAll = function() {
//         this.ajax(this.request('GET',this.all,callClear))
// }
//根据id在服务器更新一个任务
TodoApi.prototype.editTodo = function(id, newtask) {
        this.ajax(this.request('POST', this.update, callUp, newtask, id))
}

//定义一个对象
var api = new TodoApi()
//回调函数，根据后台返回的响应进行页面处理
//获取所有，对页面进行初始化
var callGet = function(response) {
    var res = JSON.parse(response)
    // log(res)
    for (var i = 0; i < res.length; i++) {
        insertTodo(res[i])
    }
}
var callAdd = function(response) {
        // api.log('calladd')
        // api.getAll()
        // log('add')
        // var input = document.querySelector('#todo-input')
        // var value = input.value
        //用返回的数据更新页面
        var res = JSON.parse(response)
        // log(res)
        if (res !== null) {
            // var value = res.task
            // var id = res.id
            // var todo = {
            //     task :value,
            //     time :currentTime(),
            //     timeDone: '未完成'
            // }
            // log(res)
            insertTodo(res)
            // input.value = ''
            // getAll()
        } else {
            alert('添加失败')
        }
}
var callDel = function(response) {
        var res = JSON.parse(response)
        if (res !== null) {
            var id = res
            log(id)
            var deleteCell = $(`[data-id=${id}]`)[0]
            deleteCell.remove()
            // api.getAll()
        } else {
            alert('删除失败')
        }
    // var id = response
}
var callUp = function(response) {
    var res = JSON.parse(response)
    if (res !== null) {
        alert('更新成功')
    }else {
        alert('更新失败')
    }
}
//////////////////////////////////各种控件绑定事件///////////////////////////////////////////////
var currentTime = function() {
  //时间标准库
    var d = new Date()
    var month = d.getMonth() + 1
    var date = d.getDate()
    var hours = d.getHours()
    var minutes = (d.getMinutes() > 10) ? d.getMinutes() : '0' + d.getMinutes()
    var seconds = (d.getSeconds() > 10) ? d.getSeconds() : '0' + d.getSeconds()
    var timeString = `${month}/${date} ${hours}:${minutes}:${seconds}`
    return timeString
}
//注意，需要事件委托时，给父元素绑定属性之后，需要先判定这是不是所需的子元素，如果是在进行相应操作。
//如给container绑定时判定是哪个按钮，或者是不是span，这样避免其他子元素有相同操作时干扰
var bindEventAdd = function() {
  //获取input的值，并利用insertAdjacentHTML插入新代码
  var add = document.querySelector('#todo-button')
  add.addEventListener('click',function(){
      var input = document.querySelector('#todo-input')
      var inputValue = input.value

      if (inputValue) {
         //注意这里应该用ajax发送数据，等后台返回添加成功的响应后再在回调函数callAdd里进行页面添加的操作
         //不然有可能后台没有添加到，这时候不能在页面添加，应该给出添加失败信息
         api.addTodo(inputValue, callAdd)
      }
  })
}
var insertTodo = function(todo) {
        var container = document.querySelector('#container')
        var t = templateTodo(todo)
        container.insertAdjacentHTML('beforeend',t)
    }
var templateTodo = function(todo) {
        //以下为模板字符串
        // <span class = 'time'>开始时间： ${todo.time}</span>
        // <span class = 'timeDone'>完成时间： ${todo.timeDone}</span>
        var t = `
        <div class="cell" data-id=${todo.id}>
            <span class = "task">${todo.task}</span>
            <div class='timeBox'>
            </div>
            <button class = "todo-done button" name="button" >完成</button>
            <button class = "todo-delete button" name="button">删除</button>
            <button class = "todo-edit button" name="button">编辑</button>
        </div>
        `
        return t
    }

var bindEventsbutton = function() {
  //给父元素container添加两个按钮的click属性
  var container = document.querySelector('#container')
  container.addEventListener('click',function(event){
      var self = event.target
      //用event.target获取点击的元素，并检查包含的class以确定为哪个按钮
      if (self.classList.contains('todo-done')) {
          //如果是完成按钮，就添加可以开关done的属性
          var todoDiv = self.parentElement
          toggle(todoDiv,'done')
          //如果完成，导入完成时间,如果没有，撤销完成时间
          if (todoDiv.classList.contains('done')) {
            // var index = indexOfElement(todoDiv)
            // log('done')
            todoDiv.querySelector('.timeDone').innerHTML = `完成时间： ` + currentTime()
            // todoList[index].timeDone = currentTime()
            // saveTodos()
            // log(todoList)*
        } else {
            // var index = indexOfElement(todoDiv)
            todoDiv.querySelector('.timeDone').innerHTML = `完成时间： 未完成`
            // todoList[index].timeDone = '未完成'
            // saveTodos()
        }
          //如果是删除按钮，就删掉该div
      } else if (self.classList.contains('todo-delete')) {
          GuaAlert2('注意','确认要删除吗？', function(r){
              if (r) {
                    var todoDiv = self.parentElement
                    //获取目标元素的id
                    // var index = indexOfElement(todoDiv)
                    //这里不应该直接在页面内remove元素，应该先发请求，等到回应后在回调函数里面删除
                    //这样可以避免删除失败在页面内不同步。
                    //获取要删除cell的id
                    var id = todoDiv.dataset.id
                    api.delTodo(id)
                    // todoDiv.remove()
                    // saveTodos()
              } else {
                  log('没有删除')
              }
          })
      } else if (self.classList.contains('todo-edit')) {
          // log('edit')
          var todoDiv = self.parentElement
          // log(todoDiv)
          // var index = indexOfElement(todoDiv)
          var task = todoDiv.querySelector('.task')
        //   用以下的代码选择task也可以，他是父元素的第四个子元素
        //   var task = todoDiv.children[3]
          task.contentEditable = "true"
          //   也可以用以下的代码定义可编辑性，注意contenteditable都是小写
        //   task.setAttribute('contenteditable', 'true')
          task.focus()
          // log(task.focus())
      }
  })
}
//给编辑框blur的时候绑定函数，即在页面保存并更新服务器上的数据
var bindEventBlur = function() {
  var container = document.querySelector('#container')
  container.addEventListener('blur',function(event){
      var self = event.target
      if (self.classList.contains('task')) {
        self.contentEditable = "false"
        var parent = self.parentElement
        // var index = indexOfElement(parent)
        var id = parent.dataset.id
        var newValue = self.innerHTML
        // todoList[index].task = newValue
        api.editTodo(id, newValue)
      }
  },true)
}

var bindEventEnter = function() {
  container.addEventListener('keydown',function(event){
          var self = event.target
          var parent = self.parentElement
          if(event.key === 'Enter') {
              log('按了回车')
              //使焦点不在输入框并且阻止默认行为的发生, 也就是不插入回车
              self.blur()
              event.preventDefault()
              //更新todoList并且保存
              //找到其父元素，即todo-cell是第几个，在对应的todoList里面修改
            //   var index = indexOfElement(parent)
              //获取修改后的值
            //   var newValue = self.innerHTML
            //   todoList[index].task = newValue
            //   saveTodos()
          }
  })
}
var toggle = function(element,className) {
      if (element.classList.contains(className)) {
          element.classList.remove(className)
      } else {
          element.classList.add(className)
      }
  }

    //saveTodos将todoList的数据保存到本地，用JSON
var saveTodos = function() {
        // var s = JSON.stringify(todoList)
        // localStorage.todoList = s
        // log(s)
    }
var loadTodos = function() {
    //   //loadTodos将todoList的数据读取，并返回原数组
    //     var a = localStorage.todoList
    //     return JSON.parse(a)
    }

var initTodos = function() {
  // //刚打开页面时，用loadTodos将之前保存的数据todoList导入,注意这里不能用var todoList，因为要代替原来的
  // todoList = loadTodos()
  // for (var i = 0; i < todoList.length; i++) {
  //     insertTodo(todoList[i])
  // }
  api.getAll()
}

var bindEvents = function() {
  bindEventAdd()
  //调用inputblur会使add按钮失去作用，因为只要按add，就会使input blur
  // inputBlur()
  bindEventsbutton()
  bindEventBlur()
  bindEventEnter()
}

var __main = function() {
    initTodos()
    bindEvents()
}

__main()
