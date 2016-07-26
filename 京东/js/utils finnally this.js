var utils=(function () {

    var isStandBrowser = 'getComputedStyle' in window;

    function listToArray(likeArray) {
        if (isStandBrowser) {
            return Array.prototype.slice.call(likeArray, 0);
        } else {
            var ary = [];
            for (var i = 0; i < likeArray.length; i++) {
                ary[ary.length] = likeArray[i];
            }
            return ary;
        }
    }


    function jsonParse(jsonStr){
        return 'JSON' in window?JSON.parse(jsonStr):eval('('+jsonStr+')');
    }

    function offset(ele){
        var l=ele.offsetLeft,t=ele.offsetTop,parent=ele.offsetParent;
        while(parent){
            l+=parent.clientLeft+parent.offsetLeft;
            t+=parent.clientTop+parent.offsetTop;
            parent=parent.offsetParent;
        }
        return {
            left:l,
            top:t
        }
    }

    function win(attr,val){
        if(typeof val!=='undefined'){
            document.documentElement[attr]=val;
            document.body[attr]=val;
        }else{
            return document.documentElement[attr]||document.body[attr];
        }
    }


    function children(ele,tagName) {
        var ary = [];
        if (isStandBrowser) {
            ary = listToArray(ele.children);
        }
        else {
            var childnodes = ele.childNodes;
            for (var i = 0; i < childnodes.length; i++) {
                var curNode = childnodes[i];
                if (curNode.nodeType == 1) {
                    ary.push(curNode);
                }
            }
            childnodes = null;
        }
        if (typeof tagName == 'string') {
            for (var i = 0; i < ary.length; i++) {
                var cur = ary[i];
                if (cur.nodeName.toLowerCase() !== tagName.toLowerCase()) {
                    ary.splice(i, 1);
                    i--;
                }
            }
            return ary;
        }

    }

    function prev(ele) {
            if (isStandBrowser) {
                return ele.previousElementSibling;
            }
            var pre = ele.previousSibling;
            while (pre && pre.nodeType !== 1) {
                pre = pre.previousElementSibling;
            }
            return pre;
        }

    function next(ele) {
            if (isStandBrowser) {
                return ele.nextElementSibling;
            }
            var next = ele.nextElementSibling;
            while (next && next.nodeType !== 1) {
                next = next.nextSibling;
            }
            return next;
        }

    function previousAll(ele) {
            var ary = [];
            var pre = prev(ele);
            while (pre) {
                ary.unshift(pre);
                pre = prev(pre);
            }
            return ary;
        }

    function nextAll(ele) {
            var nex = next(ele);
            var ary = [];
            while (nex) {
                ary.push(nex);
                nex = next(nex);
            }
            return ary;
        }

    function sibling(ele) {
            var preElement = prev(ele);
            var nextElement = next(ele);
            var ary = [];
            if (preElement) ary.unshift(preElement);
            if (nextElement) ary.push(nextElement);
            return ary;
        }

    function siblings(ele) {
            return previousAll(ele).concat(nextAll(ele));
        }

    function index(ele) {
            return previousAll(ele).length;
        }

    function firstEleChild(ele) {
            var childs = children(ele);
            return childs.length > 0 ? childs[0] : null;
        }

    function lastEleChild(ele) {
            var childs = children(ele);
            return childs.length > 0 ? childs[childs.length - 1] : null;
        }

    function append(ele, container) {
            container.appendChild(ele);
        }

    function prepend(ele, container) {
            var first = firstEleChild(container);
            if (first) {
                container.insertBefore(ele, first);
                return
            }
            container.appendChild(ele);
        }

    function insertBefore(newEle, oldEle) {
            oldEle.parentNode.insertBefore(newEle, oldEle);
        }

    function insertAfter(newEle, oldEle) {
            var nexEle = next(oldEle);
            if (newEle) {
                oldEle.parentNode.insertBefore(newEle, nexEle);
                return;
            }
            oldEle.parentNode.appendChild(newEle);
        }

    function getElementsByClass(strClass,context){
        context=context||document;
        if(isStandBrowser){
            return listToArray(context.getElementsByClassName(strClass));
        }
        var ary=[];
        var nodes=context.getElementsByTagName('*');
        var classAry=strClass.replace(/(^ +| +$)/g,'').split(/ +/g);
        for(var i=0;i<nodes.length;i++){
            var curClass=nodes[i].className;
            var isOk=true;
            for(var k=0;k<classAry.length;i++){
                var reg=new RegExp('\\b'+classAry[k]+'\\b','g');
                if(!reg.test(curClass)){
                    isOk=false;
                    break;
                }
            }
            if(isOk){
                ary.push(nodes[i])
            }
        }

        return ary;
    }

    function getCss(attr){
        var val=null;
        if(isStandBrowser){
            val= window.getComputedStyle(this,null)[attr];
        }
        else{//ie 678
            if(attr=='opacity'){
                val=this.currentStyle.filter;
                var regFilter=/^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val=regFilter.test(val)?regFilter.exec(val)[1]/100:1;
            }
            else{
                val=this.currentStyle[attr];
            }
        }
        var reg=/^-?\d+(\.\d+)?(px|deg|em|pt|rem)?$/;
        if(reg.test(val)){
            val=parseFloat(val);
        }
        return val;
    }

    function setCss(attr,val){
        if(attr=='opacity'){
            this.style.filter='alpha(opacity='+val*100+')';
            this.style.opacity=val;
            return;
        }
        else if(attr=='float'){
            this.style.cssFloat=val;
            this.style.styleFloat=val;
            return
        }
        var reg=/^(width|height|top|left||right|bottom|(border|margin|padding)(Left|Bottom|Top|Bottom)?)$/;
        if(reg.test(attr)){
            if(!isNaN(val)){
               val+='px';

            }
        }
        this.style[attr]=val;

    }

    function setGroupCss(options){
        options=options||[];
        if(options.toString()=='[object Object]'){
            for(var key in options){
                if(options.hasOwnProperty(key)){
                    setCss.call(this,key,options[key]);
                }

            }
        }
    }

    function hasClass(ele,strClass){
        strClass.replace(/^ +| +$/g,'');
        var reg=new RegExp('\\b'+strClass+'\\b','g');
        return reg.test(ele.className);

    }

    function addClass(ele,strClass){
        var classAry=strClass.replace(/^ +| +$/g,'').split(/ +/g);
        for(var i=0;i<classAry.length;i++){
            var curClass=classAry[i];
            if(!hasClass(ele,curClass)){
                ele.className=ele.className+' '+curClass;
            }

        }
    }

    function removeClass(ele,strClass){
        var classAry=strClass.replace(/^ +| +$/g,'').split(/ +/g);
        for(var i=0;i<classAry.length;i++){
            var curClass=classAry[i];
            if(hasClass(ele,curClass)){
                var reg=new RegExp('\\b'+curClass+'\\b','g');
                ele.className=ele.className.replace(reg,' ');

            }
        }
    }

    function css(ele){
        var argu=listToArray(arguments).slice(1);
        var secondArg=arguments[1];
        var thidrArg=arguments[2];
        if(typeof  secondArg=='string'){
         if(typeof thidrArg=='undefined'){
              return getCss.apply(ele,argu);
            }
            setCss.apply(ele,argu);


    }else{
            secondArg=secondArg||[];
            if(secondArg.toString()=='[object Object]'){
                setGroupCss.apply(ele,argu);
            }
        }

    }




    return{
        css:css,
        removeClass:removeClass,
        addClass:addClass,
        hasClass:hasClass,
        /*setGroupCss:setGroupCss,
        setCss:setCss,
        getCss:getCss,*/
        getElementsByClass:getElementsByClass,
        insertAfter:insertAfter,
        insertBefore:insertBefore,
        prepend:prepend,
        append:append,
        lastEleChild:lastEleChild,
        firstEleChild:firstEleChild,
        index:index,
        siblings:siblings,
        sibling:sibling,
        nextAll:nextAll,
        previousAll:previousAll,
        next:next,
        prev:prev,
        children:children,
        win:win,
        offset:offset,
        jsonParse:jsonParse,
        listToArray:listToArray


    }






})();
