import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
    selector: 'app-auth-page',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
    standalone: false
})
export class AuthPage {
    constructor(public readonly authService: AuthService) {}
}
