var UnitTooltip = function()
{
    this.element = null;
    this.distanceFromUnit = {x:0, y:-200};
    this.coordinateService = new Coordinates(20, TileGrid.tileRowCount);
}

UnitTooltip.prototype.getElement = function()
{
    if (! this.element)
    {
        this.element = jQuery('<div id="unittooltip"><div class="unitname"></div><div class="unitstatus"></div></div>');
        this.element.appendTo('body');
    }

    return this.element;
}

UnitTooltip.prototype.show = function(unit)
{
    var pos = this.getPlacement(unit);
    var element = this.getElement();
    element.css("left", pos.x + "px");
    element.css("top", pos.y + "px");
    element.show();
}

UnitTooltip.prototype.hide = function(unit)
{
    this.getElement().hide();
}

UnitTooltip.prototype.getPlacement = function(unit)
{
    console.log(unit.position);

    var unitpos = TileGrid.gridToViewPortCoordinates(unit.position);

    console.log(unitpos);

    var width = window.innerWidth;
    var height = window.innerHeight;
    var pos = {x:null, y:null};

    var element = this.getElement();
    if (unitpos.y + this.distanceFromUnit.y + element.outerHeight() > height)
    {
        pos.y = unitpos.y - distanceFromUnit.y - element.outerWidth();
    }
    else
    {
        pos.y = unitpos.y + this.distanceFromUnit.y;
    }

    var overx = width - (unitpos.x + this.distanceFromUnit.x + element.outerWidth())

    if (overx < 0)
    {
        pos.x = unitpos.x + this.distanceFromUnit.x + overx;
    }
    else
    {
        pos.x = unitpos.x + this.distanceFromUnit.x;
    }

    console.log(pos);

    return unitpos;
}

window.tooltip = new UnitTooltip();

