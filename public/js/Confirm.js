var Confirm = function Confirm(dispatcher)
{
	this.dispatcher = dispatcher;
	this.element = null;
	this.overlay = null;
	$(window).resize($.proxy(this.resize, this));

};

Confirm.prototype.prepare = function()
{
	if (this.element)
		this.element.remove();

	if (this.overlay)
		this.overlay.remove();

	this.element = $('<div class="confirm"><div class="msg"></div><table><tr class="buttons"></tr></div></div>').appendTo("body");

	var height = window.innerHeight;
    var width = window.innerWidth;

	this.overlay =  $('<div class="confirmoverlay" style="width:'+width+'px;height:'+height+'px;"></div>').appendTo("body");
	this.overlay.on('click', function(e){ e.stopPropagation(); });
};

Confirm.prototype.show = function(time)
{
	time = time | 250;
	this.overlay.show();
	this.element.fadeIn(time);

	return this;
};

Confirm.prototype.setMessage = function(header, msg)
{
	console.log("");
	if (header)
		$('<h2>'+header+'</h2>').prependTo(this.element);

	if (msg)
		$('<p>'+msg+'</p>').prependTo(this.element.find('.msg'));

	return this;
};

Confirm.prototype.setOk = function(effect)
{
	var okElement = $('<td><button class="ok" style="background-image:url(/assets/resource/okicon.png)"></td>');

	okElement.appendTo(this.element.find('.buttons'));
	this.bindThingToElement(effect, okElement.find('button'));

	return this;
};

Confirm.prototype.setCancel = function(effect)
{
	var cancelElement = $('<td><button class="cancel" style="background-image:url(/assets/resource/cancelicon.png)"></td>');
	cancelElement.appendTo(this.element.find('.buttons'));

	cancelElement.find('button').on('click', $.proxy(this.remove, this));
	this.bindThingToElement(effect, cancelElement.find('button'));

	return this;
};

Confirm.prototype.bindThingToElement = function(thing, element)
{
	var dispatcher = this.dispatcher;

	if (typeof thing === 'function')
	{
		element.on('click', thing);
	}
	else if (thing instanceof Event)
	{
		element.on('click', function(){ dispatcher.dispatch(thing); });
	}
	else if (thing === null)
	{
		//noop, just remove confirm
	}
	else
	{
		throw "Confirm was unable to determine what the 'thing' was!";
	}
};

Confirm.prototype.remove = function()
{
	this.element.remove();
	this.overlay.remove();

	return this;
};

Confirm.prototype.resize = function()
{
	var height = window.innerHeight;
    var width = window.innerWidth;

    this.overlay.css('height', height +'px');
    this.overlay.css('width', width +'px');
};