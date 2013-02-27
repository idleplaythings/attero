
window.SideSlideMenuTimer = null;

function SideSlideMenu(position, amount, otherPos, height)
{
    this.position = position;
    this.otherPos = otherPos;
    this.amount = amount;
    this.height = height;
    this.createElement();
    this.populateElement();
    this.setElement();
}

SideSlideMenu.prototype = {

	constructor: SideSlideMenu,

    createElement: function()
    {
        this.container = $('<div class="sideSlideMenucontainer '+this.position+'" style="'+this.otherPos+'"></div>');
        this.container.css("height", this.height+"px");
        this.container.on("mouseover", this.onMouseover);
        this.container.on("mouseout", this.onMouseout);
        this.container.data("object", this);
    },

    setElement: function()
    {
        $(this.container).appendTo("body");
        var offset = 20 - this.container.outerWidth();
        this.container.css(this.position, offset+'px');

    },

    onMouseover: function( event )
    {
        var o = $(this).data("object");
        o.container.css(o.position, o.amount+'px');
    },

    onMouseout: function( event )
    {
        var o = $(this).data("object");
        var offset = 20 - o.container.outerWidth();
        o.container.css(o.position, offset+'px');
    },

    populateElement: function(){}

};

var SideSlideMenuTextures = function(position, amount, otherPos, height, textures)
{
    this.textures = textures;
    SideSlideMenu.call( this, position, amount, otherPos, height );
}

SideSlideMenuTextures.prototype = Object.create( SideSlideMenu.prototype );

SideSlideMenuTextures.prototype.populateElement = function()
{
    var perRow = Math.ceil(Object.keys(this.textures).length / 5);
    console.log(perRow);
    var count = 0;
    var first = true;

    for (var i in this.textures)
    {
        var selected = '';
        if (first)
        {
            selected = ' selected';
            first = false;
        }

        var texture = this.textures[i];
        count++;
        $('<div class="slideEntry texture'+selected+'" data-texture="'+texture.id+'" style="background-image:url('+texture.img.src+')"></div>').appendTo(this.container);
        //$(window.availableTextures[i].img).data("texture", i).appendTo("#texturecontainer");
        if (count % perRow == 0){
            $('</br>').appendTo(this.container);
        }
    }

    $(".texture", this.container).on("click", this.select);
}

SideSlideMenuTextures.prototype.select = function( event )
{
    $(".sideSlideMenucontainer .texture").removeClass("selected");
    $(".sideSlideMenucontainer .tileElement").removeClass("selected");
    $(this).addClass("selected");
    Landscaping.selectedTexture = $(this).data("texture");
    Landscaping.selectedElement = null;
}

var SideSlideMenuTileElements = function(position, amount, otherPos, height, textures)
{
    this.textures = textures;
    SideSlideMenu.call( this, position, amount, otherPos, height );
}

SideSlideMenuTileElements.prototype = Object.create( SideSlideMenu.prototype );

SideSlideMenuTileElements.prototype.populateElement = function()
{
    var perRow = Math.ceil(Object.keys(this.textures).length / 5);
    var count = 0;
    var first = true;

    for (var i in this.textures)
    {
        var selected = '';
        if (first)
        {
            selected = ' selected';
            first = false;
        }

        var texture = this.textures[i];
        count++;
        $('<div class="slideEntry tileElement'+selected+'" data-element="'+texture.id+'" style="background-image:url('+texture.img.src+');"></div>').appendTo(this.container);
        //$(window.availableTextures[i].img).data("texture", i).appendTo("#texturecontainer");
        if (count % perRow == 0){
            $('</br>').appendTo(this.container);
        }
    }

    $(".tileElement", this.container).on("click", this.select);
}


SideSlideMenuTileElements.prototype.select = function( event )
{
    $(".sideSlideMenucontainer .texture").removeClass("selected");
    $(".sideSlideMenucontainer .tileElement").removeClass("selected");
    $(this).addClass("selected");
    Landscaping.selectedElement = $(this).data("element");
    Landscaping.selectedTexture = null;
}

var SideSlideMenuBrush = function(position, amount, otherPos, height)
{
    var basePath = '../bundles/atterogame';

    this.brushes = Array
    (
        {id:1, src: basePath + '/textures/brush.png'},
        {id:2, src: basePath + '/textures/eraser.png'},
        {id:3, src: basePath + '/textures/up.png'},
        {id:4, src: basePath + '/textures/down.png'}
    );
    SideSlideMenu.call( this, position, amount, otherPos, height );
}

SideSlideMenuBrush.prototype = Object.create( SideSlideMenu.prototype );

SideSlideMenuBrush.prototype.populateElement = function()
{
    var first = true;

    for (var i in this.brushes)
    {
        var selected = '';
        if (first)
        {
            selected = ' selected';
            first = false;
        }

        $('<div class="slideEntry brush'+selected+'" data-brush="'+i+'" style="background-image:url('+this.brushes[i].src+')"></div>').appendTo(this.container);
    }

    $(".brush", this.container).on("click", this.selectBrush);
}

SideSlideMenuBrush.prototype.selectBrush = function( event )
{
    $(".sideSlideMenucontainer .brush").removeClass("selected");
    $(this).addClass("selected");
    Landscaping.selectedBrush = $(this).data("brush")+1;
}

var SideSlideMenuBrushSize = function(position, amount, otherPos, height)
{
    var basePath = '../bundles/atterogame';

    this.brushes = Array
    (
        {id:1, src: basePath + '/textures/small.png'},
        {id:2, src: basePath + '/textures/medium.png'},
        {id:3, src: basePath + '/textures/large.png'},
        {id:4, src: basePath + '/textures/spray.png'}
    );
    SideSlideMenu.call( this, position, amount, otherPos, height );
}

SideSlideMenuBrushSize.prototype = Object.create( SideSlideMenu.prototype );

SideSlideMenuBrushSize.prototype.populateElement = function()
{
    var first = true;

    for (var i in this.brushes)
    {
        var selected = '';
        if (first)
        {
            selected = ' selected';
            first = false;
        }

        $('<div class="slideEntry brushSize'+selected+'" data-brushsize="'+i+'" style="background-image:url('+this.brushes[i].src+')"></div>').appendTo(this.container);
    }

    $(".brushSize", this.container).on("click", this.selectBrushSize);
}

SideSlideMenuBrushSize.prototype.selectBrushSize = function( event )
{
    $(".sideSlideMenucontainer .brushSize").removeClass("selected");
    $(this).addClass("selected");
    Landscaping.selectedBrushSize = $(this).data("brushsize")+1;
}
