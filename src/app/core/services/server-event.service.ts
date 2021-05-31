import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

interface EventPayload<T = MessageEvent['data']> {
  type: string;
  data: T;
}

@Injectable()
export class ServerEventService {
  private readonly eventSource: EventSource;
  private readonly event$ = new BehaviorSubject<EventPayload>({
    type: null,
    data: null,
  });

  constructor() {
    this.eventSource = new EventSource(`${environment.apiUrl}/events/sse`);
  }

  getEventSource(): EventSource {
    return this.eventSource;
  }

  /**
   * Add the event listener of type `eventType` if not already
   * and return an observable emitting events of type specified
   * in `eventType`
   * @param eventType
   * @returns Observable of type EventPayload
   */
  onEvent<T = any>(eventType: string): Observable<EventPayload<T>> {
    this.eventSource.addEventListener(eventType, (evt: MessageEvent) => {
      this.event$.next({ type: evt.type, data: JSON.parse(evt.data) });
    });
    return this.event$
      .asObservable()
      .pipe(filter(({ type }) => type === eventType));
  }
}
