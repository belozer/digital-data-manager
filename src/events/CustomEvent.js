import trackImpression from './../trackers/trackImpression';
import trackLink from './../trackers/trackLink';
import Handler from './../Handler';
import { error as errorLog } from 'driveback-utils/safeConsole';
import isPromise from 'driveback-utils/isPromise';

const TRIGGER_EVENT = 'event';
const TRIGGER_IMPRESSION = 'impression';
const TRIGGER_CLICK = 'click';

class CustomEvent {
  constructor(name, trigger, setting, handler, digitalData, eventManager) {
    this.name = name;
    this.trigger = trigger;
    this.setting = setting;
    this.handler = handler;
    this.digitalData = digitalData;
    this.eventManager = eventManager;
  }

  track() {
    if (this.trigger === TRIGGER_EVENT) {
      this.trackEvent();
    } else if (this.trigger === TRIGGER_CLICK) {
      this.trackClick();
    } else if (this.trigger === TRIGGER_IMPRESSION) {
      this.trackImpression();
    }
  }

  newHandler(args) {
    return new Handler(this.handler, this.digitalData, args);
  }

  resolveHandlerAndFireEvent(args) {
    const handler = this.newHandler(args);
    const result = handler.run();
    if (result) {
      if (isPromise(result)) {
        result.then((event) => {
          this.fireEvent(event);
        });
      } else {
        this.fireEvent(result);
      }
    }
  }

  trackEvent() {
    if (!this.setting) return;
    this.eventManager.addCallback(['on', 'event', (event) => {
      if (event.name === this.setting) {
        this.resolveHandlerAndFireEvent([event]);
      }
    }]);
  }

  trackImpression() {
    if (!this.setting) return;
    trackImpression(this.setting, (elements) => {
      this.resolveHandlerAndFireEvent([elements]);
    });
  }

  trackClick() {
    if (!this.setting) return;
    trackLink(this.setting, (element) => {
      this.resolveHandlerAndFireEvent([element]);
    });
  }

  fireEvent(event) {
    if (!event) return;
    if (typeof event !== 'object') {
      errorLog(`Custom Event "${this.name}" was disabled: returned event should be object`);
      return;
    }
    if (!event.name) {
      errorLog(`Custom Event "${this.name}" was disabled: returned event name is undefined`);
      return;
    }
    if (this.trigger === TRIGGER_CLICK) {
      if (event.name === this.setting) {
        errorLog(`Custom Event "${this.name}" was disabled: recursion error`);
        return;
      }
    }

    if (!event.source) {
      event.source = 'DDManager Custom Event';
    }
    this.digitalData.events.push(event);
  }
}

export default CustomEvent;
