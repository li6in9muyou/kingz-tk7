import { EventBusDebug as ebd } from "../loggers.js";

class EventBus {
  subscription = new Map();
  pending_events = new Map();

  subscribe(event, callback) {
    const label = event.type ?? event;
    if (this.subscription.has(label)) {
      this.subscription.get(label).push(callback);
    } else {
      this.subscription.set(label, [callback]);
      if (this.pending_events.has(label)) {
        ebd(`there are pending events for ${label}`);
        setTimeout(() => {
          for (const event of this.pending_events.get(label)) {
            this.publish(event);
          }
          ebd(`flushed events for ${label}`);
        }, 0);
      }
    }
  }

  publish(event) {
    const label = event.type ?? event;
    const detail = event.payload;
    console.groupCollapsed(
      `EventBus: [${label}]\n detail:${JSON.stringify(detail)}`
    );

    console.groupCollapsed("stack trace");
    console.trace();
    console.groupEnd();

    const subs = this.subscription.get(label);
    if (subs === undefined) {
      if (this.pending_events.has(label)) {
        this.pending_events.get(label).push(event);
      } else {
        this.pending_events.set(label, [event]);
      }
    } else {
      console.group("subscribers");
      for (const subscriber of subs) {
        console.log(subscriber);
      }
      console.groupEnd();

      for (const subscriber of subs) {
        setTimeout(() => subscriber.call(subscriber, detail), 0);
      }
    }
    console.groupEnd();
  }
}

export default new EventBus();
