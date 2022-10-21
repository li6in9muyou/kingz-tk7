class EventBus {
  subscription = new Map();

  subscribe(event, callback) {
    const label = event.type ?? event;
    if (this.subscription.has(label)) {
      this.subscription.get(label).push(callback);
    } else {
      this.subscription.set(label, [callback]);
    }
  }

  publish(event) {
    const label = event.type ?? event;
    const detail = event.payload;
    console.groupCollapsed(`EventBus: [${label}], detail:`, detail);
    console.log(`detail: ${JSON.stringify(detail)}`);

    console.groupCollapsed("stack trace");
    console.trace();
    console.groupEnd();

    const subs = this.subscription.get(label);
    if (subs === undefined) {
      console.warn(`no subscriber for "${label}"`);
    } else {
      console.group("subscribers");
      for (const subscriber of subs) {
        console.log(subscriber);
      }
      console.groupEnd();

      for (const subscriber of subs) {
        setTimeout(subscriber, 0, subscriber, detail);
      }
    }
    console.groupEnd();
  }
}

export default new EventBus();
