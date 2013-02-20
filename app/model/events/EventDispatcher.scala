package models.events;

trait EventDispatcher {
    def attach(eventHandler: EventListener);
    def dispatch(event: Event);
}