var SaveMenu = function SaveMenu(dispatcher, saveLoad)
{
    Confirm.call( this, dispatcher);
    this.saveLoad = saveLoad;

    this.prepare();
    this.inputBox = null;
    this.createInput();
    this.element.addClass('savemapmenu');
    this.setMessage("Save map", "Insert map name");
    this.setOk($.proxy(this.saveMap, this));
    this.setCancel(null);
};

SaveMenu.prototype = Object.create( Confirm.prototype );

SaveMenu.prototype.saveMap = function()
{
    var name = this.inputBox.val();

    if ( ! name.match(/^.{3,100}$/) )
    {
        console.log("Did not match regexp");
    }
    else
    {
        console.log("I should save map: " +  name);
        var data = TileGrid.serialize();
        data.name = name;
        var json = JSON.stringify(data);
        this.submitSaveAjax(json);
    }
};

SaveMenu.prototype.submitSaveAjax = function(data)
{
    $.ajax({
        type : 'POST',
        url : '/gamemap',
        contentType: 'application/json; charset=UTF-8',
        dataType : 'json',
        data: data,
        success : this.successSave,
        error : this.errorSave
    });
};

SaveMenu.prototype.successSave = function(data)
{
    console.dir(data);
};

SaveMenu.prototype.errorSave = function(jqXHR, textStatus, errorThrown)
{
    console.dir(jqXHR);
    console.dir(errorThrown);
    window.confirm.exception({error:"AJAX error: " +textStatus} , function(){});
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
    this.inputBox.appendTo(this.element.find('.msg'));
};