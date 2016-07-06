/**
 * Created by lijie on 16/6/30.
 */
 //产生一个hash值，只有数字，规则和java的hashcode规则相同
function hashCode(str) {
    var h = 0;
    var len = str.length;
    var t = 2147483648;
    for (var i = 0; i < len; i++) {
        h = 31 * h + str.charCodeAt(i);
        if (h > 2147483647) h %= t; //java int溢出则取模
    }
    /*var t = -2147483648 * 2;
     while (h > 2147483647) {
     h += t
     }*/
    return h;
}

//时间戳来自客户端，精确到毫秒，但仍旧有可能在在多线程下有并发，
//尤其hash化后，毫秒数前面的几位都不变化，导致不同日期hash化的值有可能存在相同，
//因此使用下面的随机数函数，在时间戳上加随机数，保证hash化的结果差异会比较大
/*
 ** randomWord 产生任意长度随机字母数字组合
 ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
 ** 用法  randomWord(false,6);规定位数 flash
 * 		randomWord(true,3，6);长度不定，true
 * arr变量可以把其他字符加入，如以后需要小写字母，直接加入即可
 */
function randomWord(randomFlag, min, max) {
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}
//定义一个用来存item数量的变量;
var count = 0;
//获取item的id随机量
function gethashcode() {
    //定义一个时间戳，计算与1970年相差的毫秒数  用来获得唯一时间
    var timestamp = (new Date()).valueOf();
    var myRandom=randomWord(false,6);
    var hashcode=hashCode(myRandom+timestamp.toString());
    return hashcode;
}
/*//给li绑定mouseenter以及mouseleave事件
$("#todo-list").on({
    mouseenter:function(){
        $(this).find(".destroy").css("display","block");
    },mouseleave:function () {
        $(this).find(".destroy").css("display","none");
    }
},"li");*/
//给destroy加删除item事件
$("#todo-list").on("click",".destroy",function (){
    $(this).parent().parent().remove();
    if(!$(this).siblings("label").hasClass("tagged")){
        count--;
    }
    updatecount();
})
//给tag加横线
$("#todo-list").on("click",".tag",function (){
    tag($(this).siblings("label"));
})
//添加键盘输入事件,如果是enter即有效
$("#things-todo").keydown(function(event){
    var content = $("#things-todo").val();
    if(event.keyCode=='13' && content!=""){
        var hashcode = gethashcode();
        pushItem(hashcode,content);
    }
})
//生成item
function pushItem(id,content) {
    $("#todo-list").append('<li id="'+id+'"> <div class="item"> <input class="tag" type="checkbox"> <label>'+content+'</label> <button class="destroy"></button> </div> <input class="edit" value="'+content+'"> </li>');
    if($("#footer").css("display")=="none"||$("#content-todos").css("display")=="none"){
        $("#footer").css("display","block");
        $("#content-todos").css("display","block");
    }
    $("#things-todo").val("");
    count++;
    updatecount();
}
//更新count
function updatecount(){
    if($("#todo-list li").length == "0"){
        $("#footer").css("display","none");
        $("#content-todos").css("display","none");
    }
    $("#footer strong").html(count);
}
//画线以及去线
function tag($tag){
    if(!$tag.hasClass("tagged")){
        count--;
        /*$(event.target).siblings("label").css("text-decoration","line-through");
        $(event.target).siblings("label").css("color","#f5f5f5");*/
        $tag.addClass("tagged");
    }else {
        count++;
        /*$(event.target).siblings("label").css("text-decoration","none");
        $(event.target).siblings("label").css("color","black");*/
        $tag.removeClass("tagged");
    }
    $("#footer strong").html(count);
}
//筛选事件
$("#todo-filter li a").on("click",function () {
    $("#todo-filter li").find(".selected").removeClass("selected");
    $(this).addClass("selected");
    filterItems($(this).attr("href"));
})
//筛选items
function filterItems(v){
    switch (v){
        case "#/all" :
            $("#todo-list li").css("display","block");
            break;
        case "#/active" :
            $("#todo-list li").css("display","block");
            $("#todo-list li").find(".tagged").parent().parent().css("display","none");
            break;
        case "#/completed" :
            $("#todo-list li").css("display","none");
            $("#todo-list li").find(".tagged").parent().parent().css("display","block");
            break;

    }
}
//clearCompleted事件
$("#clear").click(function(){
    $("#todo-list li").find(".tagged").siblings(".destroy").click();
})
//全选及全取消todos事件
$("#tagall").click(function () {
    if($(this).hasClass("checkall")){
        $(this).removeClass("checkall");
        $("#todo-list li .tagged").siblings("input").click();
    }else{
        $(this).addClass("checkall");
        $("#todo-list li label:not(.tagged)").siblings("input").click();
    }
})