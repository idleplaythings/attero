var TileRepository = function TileRepository(tileString, resourceLoader)
{
    tileString = tileString.replace(/&quot;/g, '"');
    var json = JSON.parse(tileString);

    this.elements = Array();
    this.textures = Array();

    this.resourceLoader = resourceLoader;
    this.parse(json);

    console.log(this.members);
};

TileRepository.prototype.getElements = function()
{
    return this.elements;
};

TileRepository.prototype.getTextures = function()
{
    return this.textures;
};

TileRepository.prototype.getElement = function(id)
{
    if ( ! this.elements[id])
    {
        throw "TileRepository; TileElement id " +id + " not found";
    }

    return this.elements[id];
};

TileRepository.prototype.getTexture = function(id)
{
    if ( ! this.textures[id])
    {
        throw "TileRepository; TileTexture id " +id + " not found";
    }

    return this.textures[id];
};

TileRepository.prototype.parse = function(json)
{
    for (var i in json)
    {
        var o = json[i];

        if (o.img)
            o.img = this.resourceLoader.loadImage(o.img);

        var className = 'Tile' + o.type.charAt(0).toUpperCase() + o.type.slice(1);

        var effects = o.effects.split(",").map(this.parseEffect);
        var traits = o.traits.split(",").map(this.parseTrait);

        var tileMember = new window[className](o, effects);

        for (var j in traits)
        {
            if ( ! traits[j])
                continue;

            traits[j].usedBy(tileMember);
        }

        if (o.type == "element")
        {
            this.elements[tileMember.id] = tileMember;
        }
        else if (o.type == "texture")
        {
            this.textures[tileMember.id] = tileMember;
        }
    }
};

TileRepository.prototype.parseEffect = function(effect)
{
    effect = effect.trim();
    effect = effect.charAt(0).toUpperCase() + effect.slice(1);

    if (! effect)
        return null;

    effect = 'TileEffect' + effect;

    if ( ! window[effect])
    {
        console.log('TODO: ' + effect + ' is unimplemented');
        return null;
    }

    return new window[effect]();
};

TileRepository.prototype.parseTrait = function(trait)
{
    trait = trait.trim();
    trait = trait.charAt(0).toUpperCase() + trait.slice(1);

    if (! trait)
        return null;

    trait = 'TileTrait' + trait;

    if ( ! window[trait])
    {
        console.log('TODO: ' + trait + ' is unimplemented');
        return null;
    }

    return new window[trait]();
};
