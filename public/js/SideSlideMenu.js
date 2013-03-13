
window.SideSlideMenuTimer = null;

function SideSlideMenu(position, amount, otherPos, height, landscaping)
{
    this.position = position;
    this.otherPos = otherPos;
    this.amount = amount;
    this.height = height;
    this.createElement();
    this.populateElement();
    this.setElement();
    this.landscaping = landscaping;
}

SideSlideMenu.prototype = {

	constructor: SideSlideMenu,

    createElement: function()
    {
        this.container = $('<div class="sideSlideMenucontainer '+this.position+'" style="'+this.otherPos+'"></div>');
        this.container.css("height", this.height+"px");
        this.container.on("mouseover", $.proxy(this.onMouseover, this));
        this.container.on("mouseout", $.proxy(this.onMouseout, this));
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
        this.container.css(this.position, this.amount+'px');
    },

    onMouseout: function( event )
    {
        var offset = 20 - this.container.outerWidth();
        this.container.css(this.position, offset+'px');
    },

    populateElement: function(){}

};

var SideSlideMenuTextures = function(position, amount, otherPos, height, textures, landscaping)
{
    this.textures = textures;
    SideSlideMenu.call( this, position, amount, otherPos, height, landscaping );
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

    $(".texture", this.container).on("click", $.proxy(this.select, this));
}

SideSlideMenuTextures.prototype.select = function( event )
{
    $(".sideSlideMenucontainer .texture").removeClass("selected");
    $(".sideSlideMenucontainer .tileElement").removeClass("selected");
    $(this).addClass("selected");
    this.landscaping.selectedTexture = $(this).data("texture");
    this.landscaping.selectedElement = null;
}

var SideSlideMenuTileElements = function(position, amount, otherPos, height, textures, landscaping)
{
    this.textures = textures;
    SideSlideMenu.call( this, position, amount, otherPos, height, landscaping );
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

    $(".tileElement", this.container).on("click", $.proxy(this.select, this));
};


SideSlideMenuTileElements.prototype.select = function( event )
{
    var element = $(event.srcElement);
    $(".sideSlideMenucontainer .texture").removeClass("selected");
    $(".sideSlideMenucontainer .tileElement").removeClass("selected");
    element.addClass("selected");
    this.landscaping.selectedElement = element.data("element");
    this.landscaping.selectedTexture = null;
}

var SideSlideMenuBrush = function(position, amount, otherPos, height, landscaping)
{
    this.brushes = Array
    (
        {id:1, src:'/assets/textures/brush.png'},
        {id:2, src:'/assets/textures/eraser.png'},
        {id:3, src:'/assets/textures/up.png'},
        {id:4, src:'/assets/textures/down.png'}
    );
    SideSlideMenu.call( this, position, amount, otherPos, height, landscaping );
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

    $(".brush", this.container).on("click", $.proxy(this.selectBrush, this));
}

SideSlideMenuBrush.prototype.selectBrush = function( event )
{
    $(".sideSlideMenucontainer .brush").removeClass("selected");
    $(this).addClass("selected");
    this.landscaping.selectedBrush = $(this).data("brush")+1;
}

var SideSlideMenuBrushSize = function(position, amount, otherPos, height, landscaping)
{
    this.brushes = Array
    (
        {id:1, src:'/assets/textures/small.png'},
        {id:2, src:'/assets/textures/medium.png'},
        {id:3, src:'/assets/textures/large.png'},
        {id:4, src:'/assets/textures/spray.png'}
    );
    SideSlideMenu.call( this, position, amount, otherPos, height, landscaping );
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

    $(".brushSize", this.container).on("click", $.proxy(this.selectBrushSize, this));
}

SideSlideMenuBrushSize.prototype.selectBrushSize = function( event )
{
    $(".sideSlideMenucontainer .brushSize").removeClass("selected");
    $(this).addClass("selected");
    this.landscaping.selectedBrushSize = $(this).data("brushsize")+1;
}
