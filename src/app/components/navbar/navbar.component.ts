import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  @Output() viewChange = new EventEmitter<'dashboard' | 'calendar' | 'member-stats'>();

  activeView: 'dashboard' | 'calendar' | 'member-stats' = 'dashboard';

  switchView(view: 'dashboard' | 'calendar' | 'member-stats') {
    this.activeView = view;
    this.viewChange.emit(view);
  }
}
