import { NgModule } from '@angular/core';

import { AuthGuard } from './guards';
import { AuthService } from './services';

@NgModule({
  providers: [AuthGuard, AuthService],
})
export class CoreModule {}
