var Confirm = function Confirm(dispatcher)
{
	this.dispatcher = dispatcher;
	this.element = null;
	this.overlay = null;

	this.okElement = null;
	this.cancelElement = null;

	$(window).resize($.proxy(this.resize, this));
};

Confirm.prototype.prepare = function()
{
	if (this.element)
		this.element.remove();

	if (this.overlay)
		this.overlay.remove();

	this.element = $('<div class="confirm"><h2></h2><div class="msgcontainer"><p class="msg"></p><p class="error"></p></div><table><tr class="buttons"></tr></div></div>').appendTo("body");

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
	if (header)
		this.element.find('h2').html(header);

	if (msg)
		this.element.find('.msg').html(msg);

	return this;
};

Confirm.prototype.setError = function(msg)
{
	this.element.find('.error').html(msg);

	return this;
};

Confirm.prototype.setOk = function(effect)
{
	this.okElement = $('<td><button class="ok" style="background-image:url(/assets/resource/okicon.png)"></td>');

	this.okElement.appendTo(this.element.find('.buttons'));
	this.bindThingToElement(effect, this.okElement.find('button'));

	return this;
};

Confirm.prototype.setCancel = function(effect)
{
	this.cancelElement = $('<td><button class="cancel" style="background-image:url(/assets/resource/cancelicon.png)"></td>');
	this.cancelElement.appendTo(this.element.find('.buttons'));

	this.cancelElement.find('button').on('click', $.proxy(this.remove, this));
	this.bindThingToElement(effect, this.cancelElement.find('button'));

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