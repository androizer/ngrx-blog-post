import { NgModule } from '@angular/core';
import { AuthService } from './services';
import { TokenGuard } from './guards';

@NgModule({
  providers: [TokenGuard, AuthService],
})
export class CoreModule {}
