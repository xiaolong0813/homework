    var log = function() {console.log.apply(console, arguments)}
    //插入控件模板字符串
    var insertContainer = function(position, songList) {
        var numOfsongs = songList.length
        var menuArray = []
        var songArray = []
        for (var i = 0; i < numOfsongs; i++) {
            var id = songList[i].id
            var name = songList[i].name
            var form = songList[i].form
            var author = songList[i].author
            var back = songList[i].back
            var path = songList[i].path
            var sign = `<i class="fa fa-volume-down" aria-hidden="true"></i>`
            var menuCell = `<menuList class=menu-cell>${sign} <menuTitle>${name}-${author}</menuTitle><menuDelete>x</menuDelete></menuList>`
            var dataCell = `<song data-id=${id}><name>${name}</name><form>${form}</form><author>${author}</author><back>${back}</back><path>${path}</path></song>`
            menuArray.push(menuCell)
            songArray.push(dataCell)
        }
        var menuList = menuArray.join('\n')
        var dataList = songArray.join('\n')
        var t = `<audio id=id-audio-music src="" data-index='' data-num=${numOfsongs}></audio>
        <menu>
            <menuHead class='menu-cell munu-fixed'>播放列表 (<span>${numOfsongs}</span>)</menuHead>
            <menuListContainer>
                ${menuList}
            </menuListContainer>
            <menuClose class='menu-cell munu-fixed'>关闭</menuClose>
        </menu>
        <data>
            ${dataList}
        </data>
        <logo>
            <title1></title1>
            <title2></title2>
            <hr/>
            <img src="" alt="图片不可见" id=rotate/>
        </logo>
        <div id=formbackground style="position:fixed; top:0; width:100%; height:100%; z-index:-1">
            <img src="" alt="" height="100%" width="100%" />
        </div>
        <control>
            <div class="player-play-slider player-slider">
                <time id=id-time-current class=class-time></time>
                <input type="range" id=id-time-slider class=class-slider value=0 min=0 max=100 step=0.01>
                <time id=id-time-duration class=class-time></time>
            </div>
            <div class="player-volume-slider player-slider">
                <button id=id-volume-mute><i class="fa fa-volume-down" aria-hidden="true"></i></button>
                <input type="range" id=id-volume-slider class=class-slider value=1 min=0 max=1 step=0.001>
            </div>
            <div class="player-play-mode">
                <button data-action=loop id=id-player-mode><i class="fa fa-recycle" aria-hidden="true"></i></button>
                <button data-action=prev><i class="fa fa-step-backward" aria-hidden="true"></i></button>
                <button data-action=play class=multi-button><i class="fa fa-play-circle-o" aria-hidden="true"></i></button>
                <button data-action=next><i class="fa fa-step-forward" aria-hidden="true"></i></button>
                <button data-action=menu id=id-player-menu><i class="fa fa-list-ul" aria-hidden="true"></i></button>
            </div>
        </control>`
        $(position).append(t)
    }
    //给按钮绑定事件，用事件委托
    var bindPlayEvents = function() {
        $('.player-play-mode').on('click', 'button', function(e){
            var self = $(e.target).closest('button')[0]
            // log(self)
            var type = self.dataset.action
            var actions = {
                single: singleMode,
                loop: loopMode,
                random: randomMode,
                prev: prevSong,
                play: playSong,
                pause: pauseSong,
                next: nextSong,
                menu: songMenu,
            }
            var action = actions[type]
            action(self)
        })
    }
    //播放
    var playSong = function(button) {
        $('#id-audio-music')[0].play()
        button.dataset.action = 'pause'
        button.innerHTML = '<i class="fa fa-pause-circle-o" aria-hidden="true"></i>'
        //旋转图片
        imgRotate(true)

    }
    //暂停
    var pauseSong = function(button) {
        $('#id-audio-music')[0].pause()
        button.dataset.action = 'play'
        button.innerHTML = '<i class="fa fa-play-circle-o" aria-hidden="true"></i>'
        imgRotate(false)
    }
    //单曲循环
    var singleMode = function(button) {
        // log('single')
        button.dataset.action = 'loop'
        button.innerHTML = '<i class="fa fa-recycle" aria-hidden="true"></i>'
    }
    //列表循环
    var loopMode = function(button) {
        // log('loop')
        button.dataset.action = 'random'
        button.innerHTML = '<i class="fa fa-random" aria-hidden="true"></i>'
    }
    //随机循环
    var randomMode = function(button) {
        // log('random')
        button.dataset.action = 'single'
        button.innerHTML = '<i class="fa fa-refresh" aria-hidden="true"></i>'
    }
    //按照mode和偏移的方向返回offset值
    var modeOffset = function(directionNum, mode) {
        var modeIndex
        var num = $('#id-audio-music')[0].dataset.num
        if (mode === 'single') {
            modeIndex = 0
        } else if (mode === 'loop') {
            modeIndex = parseInt(directionNum)
        } else if (mode === 'random') {
            modeIndex = Math.floor((parseInt(num) - 1) * Math.random() + 1)
        }
        return modeIndex
    }
    //上一首
    var prevSong = function() {
        var mode = $('#id-player-mode')[0].dataset.action
        var modeIndex = modeOffset(-1, mode)
        songOffset(modeIndex)
        setTitle()
        // log('prev',modeIndex)
    }
    //下一首
    var nextSong = function() {
        var mode = $('#id-player-mode')[0].dataset.action
        var modeIndex = modeOffset(1, mode)
        songOffset(modeIndex)
        setTitle()
        // log('next',modeIndex)
    }
    //菜单，这里绑定的只是让菜单弹出的功能，不能在这里给里面的按钮绑定功能，应该放在外面
    var songMenu = function() {
        $('menu').animate({
            bottom: '0'
        },'fast')
        // var index = parseInt($('#id-audio-music')[0].dataset.index)
        songActive()
    }
    //给某一个歌绑定激活事件
    var songActive = function() {
        var index = parseInt($('#id-audio-music')[0].dataset.index)
        $('menuList').each(function(i, e){
            $(e).find('i').hide()
            $(e).css('color', 'black')
        })
        var target = $($('menuList')[index])
        target.find('i').show()
        target.css('color', 'red')
    }
    //给菜单上的按钮绑定事件,注意不能把这些事件写入弹出菜单的函数里面，这样每次打开这个
    //菜单都会赋一次这些函数，即你打开了n次菜单，点击按钮就会执行n次事件
    var bindMenu = function() {
        $('menuClose').on('click', function(){
            $('menu').animate({
                bottom: '-300px'
            },'fast')
        })
        //绑定删除歌曲事件
        $('menuDelete').on('click', function(e){
            var index = parseInt($(e.target).parent().index())
            var currentIndex = parseInt($('#id-audio-music')[0].dataset.index)
            log(index, currentIndex)
            $(e.target).parent().remove()
            $($('song')[index]).remove()
            $('#id-audio-music')[0].dataset.num -= 1
            $($('menuHead').find('span'))[0].innerHTML -= 1
            if (currentIndex > index) {
                $('#id-audio-music')[0].dataset.index -= 1
            } else if (currentIndex === index) {
                // $('#id-audio-music')[0].src = songSrc(index)
                // $('#id-audio-music')[0].play()
                $('#id-audio-music')[0].dataset.index -= 1
                nextSong()
                songActive()
            }
        })
        //绑定激活当前歌曲状态的功能
        $('menuListContainer').on('click', 'menuList', function(e){
            var cellIndex = $(e.target).closest('menuList').index()
            songActive()
        })
    }
    //歌曲offset
    var songOffset = function(offset) {
        var index = parseInt($('#id-audio-music')[0].dataset.index)
        var num = parseInt($('#id-audio-music')[0].dataset.num)
        var newIndex = (index + num + offset) % num
        $('#id-audio-music')[0].dataset.index = newIndex
        // var newSrc = $('#id-audio-music').find('source')[newIndex].src
        var newSrc =songSrc(newIndex)
        var player = $('#id-audio-music')[0]
        // log(player.paused)
        // player.autoplay = !player.paused

        var state = $('.multi-button')[0].dataset.action
        if (state === 'pause') {
            player.autoplay = true
        } else if (state === 'play') {
            player.autoplay = false
        }
        player.src = newSrc
        // player.play()
    }
    //时间slider事件
    var bindTimeSlider = function() {
        var player = $('#id-audio-music')[0]
        $('#id-time-slider').on('input', function(e){
            // $('#id-audio-music').off('timeupdate')
            var self = e.target
            // log(self.value / 100 * player.duration)
            player.currentTime = self.value / 100 * player.duration
        })
    }
    //声音slider和静音事件事件
    var bindVolumeSlider = function() {
        var player = $('#id-audio-music')[0]
        var volumeSlider = $('#id-volume-slider')
        var mute = $('#id-volume-mute')
        var currentVolume = 0
        // player.volume = Number(volumeSlider.val())
        //绑定声音slider事件
        volumeSlider.on('input', function(){
            var value = Number(volumeSlider.val())
            if (player.muted === true) {
                player.muted = false
            }
            player.volume = value
        })
        //绑定静音事件
        mute.closest('button').on('click', function(){
            if (player.muted === false) {
                mute.html('<i class="fa fa-volume-off" aria-hidden="true"></i>')
                player.muted = true
                currentVolume = Number(volumeSlider.val())
                volumeSlider.val(0)
            } else {
                mute.html('<i class="fa fa-volume-down" aria-hidden="true"></i>')
                player.muted = false
                volumeSlider.val(currentVolume)
            }
        })
    }
    //audio加载完，运行以及拖动slider事件(这两种事件都可以触发timeupdate)-触发slider和时间变化
    var bindAudioEvents = function() {
        var player = $('#id-audio-music')[0]
        var slider = $('#id-time-slider')[0]
        //加载完的函数
        $('#id-audio-music').on('canplay', function(e){
            var player = e.target
            var durationTime = labelFromTime(player.duration)
            $('#id-time-current').text('00:00')
            $('#id-time-duration').text(durationTime)
        })
        // //拖动slider以及自动更新的函数
        // $('#id-audio-music').on('timeupdate' , function(){
        //     // log(player.currentTime,player.duration)
        //     var sliderValue = player.currentTime / player.duration * 100
        //     slider.value = sliderValue
        //     playerTimeUpdate(player.currentTime, player.duration)
        // })
        //interval 实现slider移动
        $('#id-audio-music').on('timeupdate' , function(){
            // log(player.currentTime,player.duration)
            var sliderValue = player.currentTime / player.duration * 100
            slider.value = sliderValue
            playerTimeUpdate(player.currentTime, player.duration)
        })
        $('#id-audio-music').on('ended', function(){
            nextSong()
        })
    }
    //设置显示时间
    var playerTimeUpdate = function(current, duration) {
        var currentTime = labelFromTime(current)
        var durationTime = labelFromTime(duration)
        $('#id-time-current').text(currentTime)
        $('#id-time-duration').text(durationTime)
    }
    //处理时间
    var labelFromTime = function(time) {
        var minutes = zeroAdd(Math.floor(time / 60))
        var seconds = zeroAdd(Math.floor(time % 60))
        var t = `${minutes}:${seconds}`
        return t
    }
    //把时间显示不足两位的补全
    var zeroAdd = function(num) {
        num = num < 10 ? '0' + num : num
        return num
    }
    //绑定songlist的switch事件
    var playSwitch = function() {
        var player = $('#id-audio-music')[0]
        $('menuList').on('click', function(e){
            var song = $(e.target).closest('menuList')
            // log(player.src,song.text())
            var index = song.index()                 //用jQuery的index函数找到其位置
            // log(index)
            // 根据当前播放状态设置 autoplay
            player.autoplay = !player.paused
            //设定当前播放对象
            // player.src = song.text()
            player.src = songSrc(index)
            player.dataset.index = index
            setTitle()
        })
    }
    //根据index返回播放的src
    var songSrc = function(index) {
        if (parseInt($('#id-audio-music')[0].dataset.num) === 0) {
            alert('播放列表为空')
        }else {
            var id = $('song')[index].dataset.id
            var form = $($('song')[index]).find('form').text()
            var path = $($('song')[index]).find('path').text()
            var src = `${path}${id}.${form}`
            return src
        }
    }
    //设置当前的题目和照片
    var setTitle = function() {
        var index = $('#id-audio-music')[0].dataset.index
        var title = $($('song')[index]).find('name').text()
        var author = $($('song')[index]).find('author').text()
        var photo = $($('song')[index]).find('back').text()
        $('logo').find('title1').text(title)
        $('logo').find('title2').text(author)
        $('logo').find('img')[0].src = photo
        // $('body').css("backgroundImage",`url(${photo})`)
        $('#formbackground').find('img')[0].src = photo
        $('#formbackground').find('img').css('filter','blur(40px)')
    }
    //图片旋转
    var imgRotate = function(bool) {
        if (bool) {
            var img = $('logo').find('img')
            // var deg = img.css("transform")
            var deg = eval('get' + img.css('transform'))
            // log(deg)
            var rotate = function() {
                deg = (deg + 1) % 360
                img.css('transform',`rotate(${deg}deg)`)
            }
            window.rot = setInterval(rotate,80)
        } else {
            clearInterval(rot)
        }
    }
    //获取当前旋转角度
    var getmatrix = function(a,b,c,d,e,f){  
        var aa = Math.round(180 * Math.asin(a) / Math.PI);  
        var bb = Math.round(180 * Math.acos(b) / Math.PI);  
        var cc = Math.round(180 * Math.asin(c) / Math.PI);  
        var dd = Math.round(180 * Math.acos(d) / Math.PI);  
        var deg = 0;  
        if(aa == bb || -aa == bb) {  
            deg = dd;  
        }else if(-aa + bb == 180) {  
            deg = 180 + cc;  
        }else if(aa + bb == 180){  
            deg = 360 - cc || 360 - dd;  
        }  
        return deg >= 360 ? 0 : deg;  
        //return (aa+','+bb+','+cc+','+dd);  
    }  
    //初始化,以第index首歌为初始歌曲
    var initPlayer = function(index) {
        var index = parseInt(index)
        var player = $('#id-audio-music')[0]
        //初始化audio的index和src
        $('#id-audio-music')[0].dataset.index = index
        player.src = songSrc(index)
        //初始化图片和标题
        setTitle()
        //初始化播放模式
        var modeButton = $('.player-play-mode').find('#id-player-mode')[0]
        modeButton.dataset.action = 'loop'
        modeButton.innerHTML = '<i class="fa fa-recycle" aria-hidden="true"></i>'
    }
    //绑定所有事件
    var bindEvents = function() {
        bindPlayEvents()
        bindTimeSlider()
        bindVolumeSlider()
        bindAudioEvents()
        bindMenu()
        playSwitch()
    }
    //要导入的歌曲array
    var songList = [{id:4,name:'我只在乎你',form:'mp3',author:'邓丽君',back:'imags/1.jpg',path:'music/'},
                    {id:5,name:'分手快乐',form:'mp3',author:'梁静茹',back:'imags/2.jpg',path:'music/'},
                    {id:6,name:'beat it',form:'mp3',author:'mj',back:'imags/3.jpg',path:'music/'},
                    {id:7,name:'777777',form:'mp3',author:'7777',back:'imags/3.jpg',path:'music/'},
                    {id:8,name:'8888888',form:'mp3',author:'8888',back:'imags/2.jpg',path:'music/'},]
    //主函数
    var __main = function() {
        insertContainer('body', songList)
        initPlayer(0)
        bindEvents()
    }

    // __main()
