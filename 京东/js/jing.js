/*
 $(".head .head_nav div").hover(function () {
 $(this).addClass("add");
 $(this).find(".add_contern").show()
 }, function () {
 $(this).removeClass("add");
 $(this).find(".add_contern").hide()
 })
 */

/*head*/
function box() {
    var box = document.getElementById("box");
    var mark = document.getElementById("mark")
    console.log(mark)
    box.onmouseenter = function () {
        this.style.background = "white";
        mark.style.display = "block"
    };
    box.onmouseleave = function () {
        mark.style.display = "none"
    };
}
box()
/*head*/

//轮播图开始
/*

 var step=0;
 var timer=null;
 timer=setInterval(autoMove,1000);
 function autoMove(){
 step++;
 step=(step==6)?0:step;
 $(".concert .concert_midd .inner img").eq(step).show().css({opacity:1}).siblings("img").hide();
 $(".concert .concert_midd ul li").eq(step).addClass("bg").siblings("li").removeClass("bg");
 }
 $(".concert .concert_midd ul li").mouseover(function(){
 clearInterval(timer);
 step=$(this).index();
 $(".concert .concert_midd .inner img").eq(step).show().siblings("img").hide()
 $(".concert .concert_midd ul li").eq(step).addClass("bg").siblings("li").removeClass("bg");
 })
 $(".concert .concert_midd ul li").mouseout(function(){
 timer=setInterval(autoMove,1000);
 })
 $(".concert .concert_midd a.right").click(autoMove);
 $(".concert .concert_midd a.left").click(function(){
 step--;
 step=(step==0)?7:step;
 $(".concert .concert_midd .inner img").eq(step).show().siblings("img").hide()
 $(".concert .concert_midd ul li").eq(step).addClass("bg").siblings("li").removeClass("bg");
 })
 $(".concert .concert_midd a").mouseover(function(){
 clearInterval(timer);
 })
 $(".concert .concert_midd a").mouseout(function(){
 timer=setInterval(autoMove,1000);
 })

 */
~function () {
    function AutoBind(curId, ajaxURL, interval, link) {
        this.banner = document.getElementById(curId);
        this.bannerImgWrap = this.banner.getElementsByClassName('inner')[0];
        this.divsList = this.bannerImgWrap.getElementsByTagName('div');
        this.imgList = this.bannerImgWrap.getElementsByTagName('img');
        this.focusList = this.banner.getElementsByClassName('fouce', this.banner)[0];
        this.focusListLis = this.focusList.getElementsByTagName('li');
        this.leftBtn = this.banner.getElementsByTagName('a')[0];
        this.rightBtn = this.banner.getElementsByTagName('a')[1];


        this.data = null;
        this.timer = null;
        this.step = 0;
        this.interval = interval || 3000;
        this.ajaxURL = ajaxURL;
        this.link = link;
        return this.init();


    }

    AutoBind.prototype = {
        constructor: AutoBind,
        getData: function () {
            var _this = this;
            var xhr = new XMLHttpRequest();
            xhr.open('get', this.ajaxURL + '?_=' + Math.random(), false);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)) {
                    _this.data = utils.jsonParse(xhr.responseText);
                }
            }
            xhr.send(null);
        },
        bindData: function () {
            var str = "";
            var strFocus = '';
            if (this.data) {
                for (var i = 0, l = this.data.length; i < l; i++) {
                    var curData = this.data[i];
                    str += '<div><img src="" trueSrc="' + curData.src + '" /></div>';
                    if (i === 0) {
                        strFocus += '<li class="bg"></li>';
                    } else {
                        strFocus += '<li></li>';
                    }
                }
                str += '<div><img src="" trueSrc="' + this.data[0].src + '" /></div>';
                this.bannerImgWrap.innerHTML = str;
                this.focusList.innerHTML = strFocus;
                utils.css(this.bannerImgWrap, 'width', (this.data.length + 1) * this.link);
            }
        },
        delayLoadImg: function () {
            var _this = this;
            for (var i = 0; i < this.imgList.length; i++) {
                (function (i) {
                    var curImg = _this.imgList[i];
                    if (curImg.isLoad) {
                        return
                    }
                    var tempImg = new Image();
                    tempImg.src = curImg.getAttribute('trueSrc');
                    tempImg.onload = function () {
                        curImg.src = this.src;
                        utils.css(curImg, 'display', 'block');
                        window.zhufengAnimate(curImg, {opacity: 1}, 300, 2);
                        tempImg = null;
                    }
                    curImg.isLoad = true;
                })(i);
            }
        },
        autoMove: function () {
            if (this.step == this.data.length) {
                this.step = 0;
                utils.css(this.bannerImgWrap, 'left', -this.step * this.link);
            }
            this.step++;
            window.zhufengAnimate(this.bannerImgWrap, {left: -this.step * this.link}, 200);
            this.focusAlign();
        },
        focusAlign: function () {
            var tempStep = this.step == this.focusListLis.length ? 0 : this.step;
            for (var i = 0; i < this.focusListLis.length; i++) {
                if (i === tempStep) {
                    this.focusListLis[i].className = 'bg';
                } else {
                    this.focusListLis[i].className = '';
                }
            }
        },
        mouseEvent: function () {
            var _this = this;
            this.banner.onmouseover = function () {
                window.clearInterval(_this.timer);
                _this.leftBtn.style.display = _this.rightBtn.style.display = 'block';
            }
            this.banner.onmouseout = function () {
                _this.timer = window.setInterval(function () {
                    _this.autoMove();
                }, _this.interval);
                _this.leftBtn.style.display = _this.rightBtn.style.display = 'none';
            }
        },
        bindEventForFocus: function () {
            for (var i = 0; i < this.focusListLis.length; i++) {
                var curFocus = this.focusListLis[i];
                curFocus.index = i;
                var _this = this;
                curFocus.onclick = function () {
                    _this.step = this.index;
                    zhufengAnimate(_this.bannerImgWrap, {left: -_this.step * _this.link}, 200);
                    _this.focusAlign();
                }
            }
        },
        leftRight: function () {
            var _this = this;
            this.leftBtn.onclick = function () {
                if (_this.step == 0) {
                    _this.step = _this.data.length;
                    utils.css(_this.bannerImgWrap, 'left', -_this.step * _this.link);
                }
                _this.step--;
                window.zhufengAnimate(_this.bannerImgWrap, {left: -_this.step * _this.link}, 200);
                _this.focusAlign();

            }
            this.rightBtn.onclick = function () {
                _this.autoMove();
            };
        },
        init: function () {
            var _this = this;
            this.getData();
            this.bindData();
            window.setTimeout(function () {
                _this.delayLoadImg();
            }, 500);
            this.timer = window.setInterval(function () {
                _this.autoMove();
            }, this.interval);
            this.focusAlign();
            this.mouseEvent();
            this.bindEventForFocus();
            this.leftRight();
            return this;

        }
    }
    window.AutoBind = AutoBind;
}()
//轮播图结束
//动画开始
/*

 var good= document.getElementById('good');
 var space= document.getElementById('spacer');
 var duration = 1000;
 var change = good.offsetWidth;
 var interval = 10;
 var step = interval*change/duration;
 /!*function linear(t,b,c,d){
 return b+t/d*c; //返回值是当前的位置
 }*!/
 var mulu = document.getElementById('mulu');
 var min =-1210;
 var max =0;
 function move(target){
 _move();
 function _move(){
 window.clearTimeout(space.timer);
 var curPosi = utils.css(space,'left');
 if(target > curPosi){
 if(curPosi + step >= max){
 window.clearInterval(space.timer);
 utils.css(space,'left',target);
 return;
 }
 curPosi += step;
 utils.css(space,'left',curPosi);
 }else if(target <= curPosi){
 if(curPosi - step <= min){
 window.clearInterval(space.timer);
 utils.css(space,'left',min);
 return;
 }
 curPosi -= step;
 utils.css(space,'left',curPosi);
 }
 space.timer = window.setTimeout(_move,20);
 }

 }
 mulu.onmouseenter = function (){
 move(max);
 utils.css(space,'left',min);
 }
 mulu.onmouseleave= function (e) {
 window.clearTimeout(space.timer);
 utils.css(space,'left',max);
 }
 */
//动画结束
//选项卡
function tabModule(selector, name, item) {
    var oBox1 = document.getElementById(selector);
    var oBox = oBox1.getElementsByTagName("div")[0];
    var nn = oBox1.getElementsByTagName("div")[1];
    var aa = nn.getElementsByClassName(name);
    oBox.onmouseover = function (ev) {
        ev = ev || window.event;
        var tar = ev.target || ev.srcElement,
            tarTag = tar.tagName.toUpperCase(),
            tar1 = tar.parentNode.parentNode,
            aName = utils.children(tar);
        if (tarTag === "LI" && tar1.className === item || aName == "a") {
            var tarSiblings = utils.siblings(tar);
            for (var i = 0; i < tarSiblings.length; i++) {
                var temp = tarSiblings[i];
                utils.removeClass(temp, "bg");
            }
            utils.addClass(tar, "bg");
            var tarDivs = aa,
                index = utils.index(tar);
            for (var k = 0; k < tarDivs.length; k++) {
                // k === index ? utils.addClass(tarDivs[k], "bock") : utils.removeClass(tarDivs[k], "bock");
                tarDivs[k].style.display = k == index ? 'block' : 'none';
            }
        }
    };
}


/*#ment #ying .file*/
var $file = $("#ying .file");
var $one = $("#meil .ming .one");
$one.mouseenter(function () {
    $(this).parent().addClass("bg5");
})
$file.click(function () {
    $one.parent().removeClass("bg5");
})

/*floorlou */
var winH = document.documentElement.clientHeight || document.body.clientHeight;
var $content = $(".delay"),
    $floorDivs = $content.children(".content"),
    $floor = $(".lou"),
    $floorUl = $floor.children(0),
    $floorLis = $floorUl.children("li");
console.log($floor)
var curL = parseFloat($content.offset().left) - parseFloat($floor.outerWidth());
curL < 0 ? curL = 40 : null;
$floor.css({
    left: curL
});

//->控制lou的显示和隐藏和楼层的定位
$(window).on("scroll", computedShow);
function computedShow() {
    var curTop = document.documentElement.scrollTop || document.body.scrollTop;
    if ((curTop + winH / 2) >= $floorDivs.eq(0).offset().top) {
        $floor.stop().fadeIn(100);
    } else {
        $floor.stop().fadeOut(100);
    }
    $floorDivs.each(function (index, item) {
        var curOffTop = $(this).offset().top;
        if ((curTop + winH / 2) >= curOffTop) {
            $floorLis.eq(index).addClass("bg").siblings().removeClass("bg");
        }
    });
}
var autoTimer = null;
$floorLis.on("click", function () {
    $(this).addClass("bg").siblings().removeClass("bg");
    var index = $(this).index(),
        tarTop = $floorDivs.eq(index).offset().top;
    $(window).off("scroll", computedShow);

    move(tarTop);
});
function move(target) {
    window.clearInterval(autoTimer);
    var curTop = document.documentElement.scrollTop || document.body.scrollTop;
    var speed = 50;
    if (curTop > target) {
        speed *= -1;
    }
    if (curTop === target) {
        return;
    }
    autoTimer = window.setInterval(function () {
        var cur = document.documentElement.scrollTop || document.body.scrollTop;
        cur += speed;

        if (speed > 0) {
            if (cur >= target) {
                document.documentElement.scrollTop = target;
                document.body.scrollTop = target;
                window.clearInterval(autoTimer);
                $(window).on("scroll", computedShow);
                return;
            }
        } else {
            if (cur <= target) {
                document.documentElement.scrollTop = target;
                document.body.scrollTop = target;
                window.clearInterval(autoTimer);
                $(window).on("scroll", computedShow);
                return;
            }
        }
        document.documentElement.scrollTop = cur;
        document.body.scrollTop = cur;
    }, 10);
}


