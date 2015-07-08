/**
 * emoji
 *
 * @desc
 * @date        15/7/8
 * @author      soulteary <soulteary@qq.com> (http://soulteary.com)
 * @package
 */
/* global $, chrome */

var emojiVersion = '1.0.3';

var emojiContainer = $('#emojiPanel');

var emojiLabel = $('#emojiPanel .title');

var emojiClass = {
    ACTIVE_LABEL : 'select',
    HIDE         : 'fn-hide',
    PANEL        : '.emoji-extra-package',
    CHAT_BOX     : '#textInput',
    CHAT_HISTORY : '#chat_chatmsglist',
    SEND_BUTTON  : '#sendMessage'
};

var NEWLINE = '\n';

var emojiList = [
    {'name' : '默认'},
    {'name' : '浪小花'},
    {'name' : '哆啦A梦'},
    {'name' : '暴走漫画'},
    {'name' : '小恐龙'},
    {'name' : '冷兔'},
    {'name' : '癫当'},
    {'name' : '阿狸'},
    {'name' : 'BOBO和TOTO'},
    {'name' : '搞怪'},
    {'name' : '小纯洁'},
    {'name' : '罗小黑'},
    {'name' : '小幺鸡'},
    {'name' : '心情'},
    {'name' : '摩丝摩丝'},
    {'name' : '桂宝'},
    {'name' : '懒猫猫'},
    {'name' : '彼尔德'}
];


var emojiPanelTpl = [
    '<div class="emoji-extra-package fn-hide" data-index="{{%index%}}">',
    '{{%item%}}' +
    '</div>'].join(NEWLINE);
var emojiItem = [
    '   <a title="{{%title%}}" href="#">',
    '       <img width="22" height="22" alt="{{%title%}}" src="{{%img%}}" data-index="{{%index%}}" />' +
    '   </a>'].join(NEWLINE);
var emojiImg = [
    '<img src="{{%img%}}" alt="{{%title%}} - 大象表情扩展包" />'
].join(NEWLINE);

var emojiLabelTpl = ['<a class="emoji-label-button" href="javascript:;"><span>大象表情包</span> <select>{{%options%}}</select></a>'].join(NEWLINE);
var emojiLabelOption = ['<option value="{{%value%}}">{{%name%}}</option>'].join(NEWLINE);

function render(template, json) {
    return template.replace(/\{\{%(.*?)%\}\}/g, function (all, key) {
        return json && (key in json) ? json[key]: '';
    });
}


/**
 * 戳表情
 */
function pickEmoji(e) {
    var target = $(e.currentTarget).find('img');
    var title = target.attr('alt');
    var imgIndex = target.attr('data-index');
    var pkgIndex = target.closest(emojiClass.PANEL).attr('data-index');

    var msg = '{{%/*!* 表情来自表情扩展包 v' + emojiVersion + ':' + title + ' *@*/' + pkgIndex + '|' + imgIndex + '%}}';
    $(emojiClass.CHAT_BOX).val($(emojiClass.CHAT_BOX).val() + msg);
    $(emojiClass.SEND_BUTTON).attr('disabled', false);
}

/**
 * 获取配置
 *
 * @param params
 */
function loadConfig(params) {

    var index = params.index;
    var path = chrome.extension.getURL('emoji/' + index + '/');

    $.ajax({
        url      : chrome.extension.getURL('emoji/' + index + '/config.json'),
        type     : 'GET',
        dataType : 'json',
        success  : function (response) {
            switch (params.mode) {
                case 'render':

                    var html = [];
                    for (var m = 0, n = response.length; m < n; m++) {
                        html.push(render(emojiItem, {
                            title : response[m].title,
                            index : (response[m].index + 1).toString(),
                            img   : path + response[m].img
                        }));
                    }

                    if (params.firstInit) {
                        emojiLabel.before(render(emojiPanelTpl, {item : html.join(NEWLINE), index : index}));
                    } else {
                        $(emojiClass.PANEL).replaceWith(render(emojiPanelTpl, {
                            item  : html.join(NEWLINE),
                            index : index
                        }));
                        $(emojiClass.PANEL).removeClass(emojiClass.HIDE);
                    }

                    $(emojiClass.PANEL)
                        .undelegate('a', 'click', pickEmoji)
                        .delegate('a', 'click', pickEmoji);
                    break;
                case 'data':

                    params.data = response;
                    params.path = path;
                    params.process(params);
                    break;
            }

        }
    });
}


if (emojiContainer.length) {

    // 处理样式
    var style = [
        '<style>',
        '.' + emojiClass.HIDE + ' {display: none !important;}',
        '.emoji-label-button {width: 220px !important;}',
        '.emoji-label-button span {margin-right: 6px !important; background: rgba(0, 0, 0, 0) !important; border: none !important; cursor: pointer;}',
        '.emoji-label-button select {border: 1px #AEAEAE solid !important;}',
        '.emoji-extra-package {overflow: hidden; padding: 8px;}',
        '.emoji-extra-package a { float: left; padding: 4px; width: 22px; height: 22px; border: 1px solid #DFE6F6; line-height: 24px; text-align: center; margin-top: -1px; margin-left: -1px;}',
        '</style>'].join(NEWLINE);
    $('head').append(style);

    // 渲染按钮模板
    var html = [];
    for (var i = 0, j = emojiList.length; i < j; i++) {
        html.push(
            render(emojiLabelOption, {
                value : i + 1,
                name  : emojiList[i].name
            })
        );
    }
    emojiLabel.append(render(emojiLabelTpl, {options : html.join(NEWLINE)}));

    // 处理按钮点击状态，屏蔽默认点击事件
    var labelButton = emojiLabel.find('.emoji-label-button');
    labelButton.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(e.target)
            .addClass(emojiClass.ACTIVE_LABEL)
            .siblings('a')
            .removeClass(emojiClass.ACTIVE_LABEL);
    });
    labelButton.find('select, span').on('click', function () {
        labelButton
            .addClass(emojiClass.ACTIVE_LABEL)
            .siblings('a')
            .removeClass(emojiClass.ACTIVE_LABEL);
    });

    // 处理新按钮标签的选择列表
    labelButton.find('select').on('change', function (e) {
        var target = $(e.target).find('option:selected').eq(0);
        var index = target.val();
        if (!index) {
            return false;
        }
        loadConfig({
            mode      : 'render',
            index     : index,
            firstInit : false
        });
    });

    // 处理添加按钮的事件
    var emojiLabels = emojiLabel.find('a');
    emojiLabels.on('click', function (e) {
        var target = $(e.target);
        var index = emojiLabels.index(target);
        var children = emojiContainer.children('div').not('.title');
        children.eq(index).removeClass(emojiClass.HIDE);
        children.not(children.eq(index)).addClass(emojiClass.HIDE);
    });

    // 启动第一次获取图片
    loadConfig({
        mode      : 'render',
        index     : 1,
        firstInit : true
    });

    /**
     * 上传gif不会显示，且会造成重复，故采取发送字符串，并替换资源的方式
     */
    setInterval(function () {
        var item = $(emojiClass.CHAT_HISTORY).find('.item .cont').not('.emoji-bingo');
        item.each(function (k, v) {
            var target = $(v);
            target.addClass('emoji-bingo');
            // 清理版本注释
            target.html(target.html().replace(/\/\*!\*.*?\*@\*\//g, ''));

            // 获取每一条内容
            var content = target.html();
            // 逐一解决占位符
            var placeholder = content.match(/\{\{%(\d+\|\d+)?%\}\}/g);
            placeholder && placeholder.map(function (item) {
                item
                    .match(/\{\{%(.*)?%\}\}/)
                    .map(function (v) {
                        // 过滤第一条match结果
                        if (v.indexOf('%') > -1) {
                            return false;
                        }
                        (function (index) {
                            loadConfig({
                                mode     : 'data',
                                index    : index[0],
                                imgIndex : parseInt(index[1]) - 1,
                                target   : target,
                                matches  : item,
                                process  : function (params) {
                                    target.html(params.target.html().replace(params.matches, function () {
                                        var data = params.data[params.imgIndex];
                                        data.img = params.path + data.img;
                                        return render(emojiImg, data);
                                    }));
                                }
                            });
                        }(v.split('|')));
                    });
            });
        });
    }, 500);
}