    var log = function() {
        console.log.apply(console, arguments)
    }
    //插入控件模板字符串
    var insertContainer = function() {
        
    }
    //给按钮绑定事件，用事件委托
    var bindPlayEvents = function() {
        $('.player-play-mode').on('click', 'button', function(e){
            var self = e.target
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
        button.innerHTML = '暂停'
    }
    //暂停
    var pauseSong = function(button) {
        $('#id-audio-music')[0].pause()
        button.dataset.action = 'play'
        button.innerHTML = '播放'
    }
    //单曲循环
    var singleMode = function(button) {
        // log('single')
        button.dataset.action = 'loop'
        button.innerHTML = '循环'
    }
    //列表循环
    var loopMode = function(button) {
        // log('loop')
        button.dataset.action = 'random'
        button.innerHTML = '随机'
    }
    //随机循环
    var randomMode = function(button) {
        // log('random')
        button.dataset.action = 'single'
        button.innerHTML = '单曲'
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
    }
    //给菜单上的按钮绑定事件,注意不能把这些事件写入弹出菜单的函数里面，这样每次打开这个
    //菜单都会赋一次这些函数，即你打开了n次菜单，点击按钮就会执行n次事件
    var bindMenu = function() {
        $('menuClose').on('click', function(){
            $('menu').animate({
                bottom: '-125px'
            },'fast')
        })
        $('menuDelete').on('click', function(e){
            var index = parseInt($(e.target).parent().index())
            var currentIndex = parseInt($('#id-audio-music')[0].dataset.index)
            log(index, currentIndex)
            $(e.target).parent().remove()
            $($('song')[index]).remove()
            $('#id-audio-music')[0].dataset.num -= 1
            if (currentIndex > index) {
                $('#id-audio-music')[0].dataset.index -= 1
            } else if (currentIndex === index) {
                // $('#id-audio-music')[0].src = songSrc(index)
                // $('#id-audio-music')[0].play()
                $('#id-audio-music')[0].dataset.index -= 1
                nextSong()
            }
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
        $('#id-audio-music')[0].src = newSrc
        $('#id-audio-music')[0].play()
    }
    //时间slider事件
    var bindTimeSlider = function() {
        var player = $('#id-audio-music')[0]
        $('#id-time-slider').on('input', function(e){
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
        mute.on('click', function(){
            if (player.muted === false) {
                player.muted = true
                currentVolume = Number(volumeSlider.val())
                volumeSlider.val(0)
            } else {
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
        //拖动slider以及自动更新的函数
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
            var song = $(e.target)
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
            var src = `${$('song')[index].dataset.id}.${$($('song')[index]).find('form').text()}`
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
        modeButton.innerHTML = '循环'
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
    //主函数
    var __main = function() {
        initPlayer(0)
        bindEvents()
    }

    // __main()
