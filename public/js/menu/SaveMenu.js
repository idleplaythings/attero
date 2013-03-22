var SaveMenu = function SaveMenu(dispatcher, saveLoad)
{
    Confirm.call( this, dispatcher);
    this.saveLoad = saveLoad;

    this.prepare();
    this.inputBox = null;
    this.createInput();
    this.element.addClass('savemapmenu');
    this.setOk($.proxy(this.saveMap, this));
    this.setCancel(null);
};

SaveMenu.prototype = Object.create( Confirm.prototype );

SaveMenu.prototype.saveMap = function()
{
    var name = this.inputBox.val();

    if ( ! name.match(/^.{3,100}$/) )
    {
        this.setError("Name length should be 3 to 100 characters");
    }
    else
    {
        var data = TileGrid.serialize();
        data.name = name;
        var json = JSON.stringify(data);

        this.startSaving();
        this.submitSaveAjax(json);
    }
};

SaveMenu.prototype.startSaving = function()
{
    this.setMessage("Save map", "Saving, please wait");
    this.cancelElement.hide();
    this.okElement.hide();
    this.inputBox.hide();
};

SaveMenu.prototype.submitSaveAjax = function(data)
{
    $.ajax({
        type : 'POST',
        url : '/gamemap',
        contentType: 'application/json; charset=UTF-8',
        dataType : 'json',
        data: data,
        success : $.proxy(this.successSave, this),
        error : $.proxy(this.errorSave, this)
    });
};

SaveMenu.prototype.successSave = function(data)
{
    console.dir(data);
    if (data.status === 'ok')
    {
        this.setMessage("Save map", "Map saved succesfully!");
        this.cancelElement.find('button').removeClass('cancel');
        this.cancelElement.find('button').css('background-image', 'url(/assets/resource/okicon.png)');
        this.cancelElement.show();
    }

    if (data.status === 'duplicate name')
    {
        this.setMessage("Save map", "Insert map name");
        this.setError("Name already used!");
        this.inputBox.show();
        this.cancelElement.show();
        this.okElement.show();
    }
};

SaveMenu.prototype.errorSave = function(jqXHR, textStatus, errorThrown)
{
    console.dir(jqXHR);
    console.dir(errorThrown);
    window.confirm.exception({error:"AJAX error: " +textStatus} , function(){});
};

SaveMenu.prototype.show = function()
{
    this.setMessage("Save map", "Insert map name");
    this.setError("");
    this.inputBox.show();

    var cancelButton = this.cancelElement.find('button');

    if (! cancelButton.hasClass('cancel'))
        cancelButton.addClass('cancel');

    cancelButton.css('background-image', 'url(/assets/resource/cancelicon.png)');

    this.cancelElement.show();
    this.okElement.show();
    time = 250;
    this.overlay.show();
    this.element.fadeIn(time);

    return this;
};

SaveMenu.prototype.remove = function()
{
    console.log("remove");
    this.element.hide();
    this.overlay.hide();

    return this;
};

SaveMenu.prototype.createInput = function()
{
    this.inputBox = $('<input type="text" class="mapnameinput">');
    this.inputBox.appendTo(this.element.find('.msgcontainer'));
};