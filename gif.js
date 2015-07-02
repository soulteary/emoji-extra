/**
 * gif
 *
 * @desc
 * @date        15/7/2
 * @author      soulteary <soulteary@qq.com> (http://soulteary.com)
 * @package
 */
/* global $ */

var gifVersion = '1.0.0';

var sClass = {
    CHAT_HISTORY : '#chat_chatmsglist',
    GIF_SUPPORT:'.js-gif-support'
};

var chatContainer = $(sClass.CHAT_HISTORY);

var NEWLINE = '\n';

var tpl = [
    '   <a title="{{%title%}}" href="{{%img%}}" target="download-frame" class="js-gif-support">',
    '       <img alt="{{%title%}}" src="{{%img%}}" />' +
    '   </a>'].join(NEWLINE);


function render(template, json) {
    return template.replace(/\{\{%(.*?)%\}\}/g, function (all, key) {
        return json && (key in json) ? json[key]: '';
    });
}


if (chatContainer.length) {

    // 处理样式
    var style = [
        '<style>',
        '.' + sClass.HIDE + ' {display: none !important;}',
        '.' + sClass.GIF_SUPPORT + ' {display: block;width: 100%;height: 100%;}',
        '.' + sClass.GIF_SUPPORT + ' img {max-width: 100%; max-height: 100%; display: block;}',
        '</style>'].join(NEWLINE);
    $('head').append(style);

    setInterval(function () {
        var item = $(sClass.CHAT_HISTORY).find('.item .cont .pic.pir-text').not('.gif-bingo');
        item.each(function (k, v) {
            var target = $(v);
            target.addClass('gif-bingo')
                .replaceWith(render(tpl, {
                    title : '点击下载此GIF图',
                    img   : target.find('a[target=download-frame]').attr('href')
                }));
        });
    }, 500);
}