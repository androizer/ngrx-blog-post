import { NgModule } from '@angular/core';
import { AuthService, ServerEventService } from './services';
import { TokenGuard } from './guards';

@NgModule({
  providers: [TokenGuard, AuthService, ServerEventService],
})
export class CoreModule {}
