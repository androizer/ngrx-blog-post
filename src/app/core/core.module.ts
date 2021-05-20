import { NgModule } from '@angular/core';
import { AuthService } from './services';
import { AuthGuard } from './guards';

@NgModule({
  providers: [AuthGuard, AuthService],
})
export class CoreModule {}
