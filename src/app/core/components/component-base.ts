import { Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive()
export class ComponentBase implements OnDestroy {
  protected _subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
