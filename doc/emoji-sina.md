## 新浪微博表情

编号1 ~ 18。

```
var task = [];
var data = [];

Array
	.prototype
	.slice
	.call(document.querySelectorAll('.UI_scrollContent img'), 0)
	.map(function(item, index){
		var url = item.getAttribute('src');
		var title = item.parentNode.getAttribute('title');
		var imgName = url.split('/');
			imgName = imgName[imgName.length-1].replace('_thumb', '');
		task.push(['wget', url, '-O', imgName].join(' '));
		data.push({
			title: title,
			img: imgName,
			index: index
		})
	});

console.log( ['', task.join('\n'), '', ''].join('\n') );
console.log( JSON.stringify(data, null, 4) );

```