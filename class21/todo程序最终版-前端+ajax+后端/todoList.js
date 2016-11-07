var todoList = []
////////////////////////////////////////////
var log = function() {console.log.apply(console, arguments)}
//////////////////////定义读取文件的函数//////////////////////////////
var loadFile = function(path) {
    var fsTxt = require('fs')
    var options = {encoding: 'utf-8'}
    fsTxt.readFile(path, options, function(err, data){
        if (err !== null) {
            log('无法读取文件')
        } else {
            todoList = JSON.parse(data)
        }
    })
}
// log(todoList)
//////////////////////定义存储文件的函数//////////////////////////////
var saveFile = function(path, data) {
    var fsTxt = require('fs')
    var options = {encoding: 'utf-8'}
    fsTxt.writeFile(path, data, function(err){
        if (err !== null) {
            throw err
        } else {
            log('保存成功')
        }
    })
}
/////////////////////////////引入express库并创建实例app，定义主页//////////////////
var express = require('express')
var app = express()
//配置静态文件,注意使用express库才有静态文件，使用fs库打开文件夹没有这种方法，需定义正确路径
// app.use(express.static('public'))
//定义用于定义post命令的函数
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
//定义主页
//定义读取文件的函数
var readFiles = function(path, response) {
    var fs = require('fs')
    var options = {encoding: 'utf-8'}
    fs.readFile(path, options, function(err, data){
        if (err !== null) {
            log('无法读取文件')
        } else {
            response.send(data)
        }
    })
}
//注意这里的路径path，读取子文件夹里的文件，路径格式为：子文件夹名/文件.html，不用
//在前面再加/
app.get('/todo', function(req, res){
    readFiles('public/todo.html', res)
})
app.get('/todo/css', function(req, res){
    readFiles('public/todo.css', res)
})
app.get('/todo/js', function(req, res){
    readFiles('public/todo.js', res)
})
app.get('/todo/pop', function(req, res){
    readFiles('public/弹窗.js', res)
})

////////////定义用于add，delete和update的函数
var addTodo = function(todo) {
    // log(todo.length)
    if (todoList.length > 0) {
        //如果有元素，新添加的元素id是最后一个元素的id + 1
        todo.id = todoList[todoList.length - 1].id + 1
    } else {
        //第一个元素的id是1
        todo.id = 1
    }
    todoList.push(todo)
    saveFile('public/data.txt', JSON.stringify(todoList))
    return todo
}
//根据id找到在todoList中的位置
var indexByid = function(id) {
    var index = -1
    for (var i = 0; i < todoList.length; i++) {
        var t = todoList[i]
        if (Number(t.id) == Number(id)) {
            index = i
            break
        }
    }
    if (index == -1) {
        return null
    } else {
        return index
    }
}

var deleteTodo = function(id) {
    var index = indexByid(id)
    var hasIndex = (index !== null)
    if (hasIndex) {
        var delTodo = todoList[index]
        todoList.splice(index, 1)
        saveFile('public/data.txt', JSON.stringify(todoList))
        return delTodo
    }else {
        return null
    }
}

var updateTodo = function(id, task) {
    var index = indexByid(id)
    var hasIndex = (index !== null)
    if (hasIndex) {
        todoList[index].task = task
        saveFile('public/data.txt', JSON.stringify(todoList))
        return todoList[index]
    } else {
        return null
    }
}
//定义todo/all页面，及响应数据
app.get('/todo/all', function(req, res){
    log(todoList)
    res.send(todoList)
})
//定义todo/add页面，及响应数据，这里需要先发送数据前端再做出响应
//因为有的数据前端没有，比如所有用户的todo放在一个todoList里面
//这时候就需要返回在所有数据里面的id
app.post('/todo/add', function(req, res){
    // todoList.push(req.body)
    var todo = addTodo(req.body)
    log(todo)
    res.send(JSON.stringify(todo))
})
//定义todo/delete页面，及响应数据
app.get('/todo/delete', function(req, res){
    // var id = req.body.id
    //这里用req.query的方式获取查询字符串，即url的?后面的部分，
    //express会把请求字符串自动转换为对象,这样就可以用get方法接受
    //数据和发送响应
    var id = Number(req.query.id)
    var delTodo = deleteTodo(id)
    log(todoList)
    res.send(JSON.stringify(id))
})
//定义todo/delete页面，及响应数据
app.post('/todo/update', function(req, res){
    var t = req.body
    var id = t.id
    var task = t.task
    var upTodo = updateTodo(id, task)
    log(todoList)
    res.send(JSON.stringify(upTodo))
})

// listen 函数的第一个参数是我们要监听的端口
var server = app.listen(8081, function(){
    var host = server.address().address
    var port = server.address().port
    log('todo访问地址为： http://%s:%s', host, port)
    loadFile('public/data.txt')
})
