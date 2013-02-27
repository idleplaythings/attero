window.confirm = {

	containerElement: $('<div class="confirm"><div class="msg"></div><div class="ui"></div><table><tr class="buttons"></tr></div></div>'),
	okElement: $('<td class="button ok">OK</td>'),
	cancelElement: $('<td class="button ok">CANCEL</td>'),
	
	confirm: function(msg, callback)
	{
		console.log('hi');
		var a = confirm.containerElement.clone().appendTo("body");
		confirm.okElement.clone().appendTo('.buttons', a);
		$('<span>'+msg+'</span>').prependTo('.msg', a);
		a.fadeIn(250);
	}

}
