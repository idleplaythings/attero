package models.events;

import scala.collection.mutable
import scala.util.control.Breaks._

trait EventDispatcher
{
    var eventListeners: mutable.Map[String, List[EventListener]] = mutable.Map.empty[String, List[EventListener]];

    def attach(eventListener: EventListener) =
    {
        val eventname: String = eventListener.getEventName;

        if ( ! eventListeners.contains(eventname)) {
            eventListeners += (eventname -> List(eventListener))
        } else {
            eventListeners(eventname) = eventListener +: eventListeners(eventname)
        }
    }

    def dispatch(event: Event) =
    {
        breakable {
            eventListeners(event.name).foreach({ listener =>
                listener.handle(event)
                if (event.isStopped()) {
                    println("Event propagation stopped")
                    break
                }
            });
        }

        event.setDone();
    }
}