MouseWheel =
{
    hookEvent: function(element, eventName, callback)
    {
        if(typeof(element) == "string")
            element = document.getElementById(element);
        if(element == null)
            return;
        if(element.addEventListener)
        {
            if(eventName == 'mousewheel')
                element.addEventListener('DOMMouseScroll', callback, false);
                element.addEventListener(eventName, callback, false);
        }
        else if(element.attachEvent)
            element.attachEvent("on" + eventName, callback);
    },

    unhookEvent: function(element, eventName, callback)
    {
        if(typeof(element) == "string")
            element = document.getElementById(element);
        if(element == null)
            return;
        if(element.removeEventListener)
        {
            if(eventName == 'mousewheel')
                element.removeEventListener('DOMMouseScroll', callback, false);
                element.removeEventListener(eventName, callback, false);
        }
        else if(element.detachEvent)
            element.detachEvent("on" + eventName, callback);
    },

    cancelEvent: function(e)
    {
      e = e ? e : window.event;
      if(e.stopPropagation)
        e.stopPropagation();
      if(e.preventDefault)
        e.preventDefault();
      e.cancelBubble = true;
      e.cancel = true;
      e.returnValue = false;
      return false;
    }
}

