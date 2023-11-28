import { Component, OnInit } from '@angular/core';
import {
  changeLanguageRequest,
  forceLanguageRequest,
  removeForceLanguage,
} from '../../state/language/language.actions';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import {
  getCurrentLanguage,
  isForcedLanguage,
} from '../../state/language/language.selectors';
import { take } from 'rxjs';
import { ToggleCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-language-settings',
  templateUrl: './language-settings.component.html',
  styleUrls: ['./language-settings.component.scss'],
})
export class LanguageSettingsComponent {
  currentLanguage$ = this.store.select(getCurrentLanguage);
  isForcedLanguageByUser$ = this.store.select(isForcedLanguage);

  constructor(private store: Store<AppState>) {}

  changeLanguage(event: CustomEvent) {
    const languageCode = event.detail.value;
    this.store.dispatch(changeLanguageRequest({ languageCode }));
  }

  onToggleChange(toggle: ToggleCustomEvent) {
    const wantsToForceLanguage = toggle.detail.checked;
    if (wantsToForceLanguage) this.forceLanguage();
    else this.store.dispatch(removeForceLanguage());
  }

  private forceLanguage() {
    this.store
      .select(getCurrentLanguage)
      .pipe(take(1))
      .subscribe((languageCode) =>
        this.store.dispatch(forceLanguageRequest({ languageCode })),
      );
  }
}
