

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/

import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  OnInit,
  Output,
  ViewChild
  } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { LanguageLocaleService } from '../../../../i18n/language-locale.service';
import { BaseLogger } from 'virtual-desktop-logger';

@Component({
  selector: 'rs-com-launchbar-widget',
  templateUrl: 'launchbar-widget.component.html',
  styleUrls: [ 'launchbar-widget.component.css' ],
  providers: [LanguageLocaleService]
})
export class LaunchbarWidgetComponent implements OnInit {
  private readonly logger: ZLUX.ComponentLogger = BaseLogger;
  private readonly plugin: any = ZoweZLUX.pluginManager.getDesktopPlugin();
  date: Date;
  popupVisible: boolean;
  @Output() popupStateChanged = new EventEmitter<boolean>();
  @ViewChild('usericon') userIcon: ElementRef;
  @ViewChild('logoutbutton') logoutButton: ElementRef;
  authenticationManager: MVDHosting.AuthenticationManagerInterface;

  // Convenience widgets for testing the i18n work
  // @ViewChild('languagebutton') languageButton: ElementRef;
  // @ViewChild('clearlanguagebutton') clearLanguageButton: ElementRef;
  // @ViewChild('localebutton') localeButton: ElementRef;

  constructor(
    private injector: Injector,
    private languageLocaleService: LanguageLocaleService
  ) {
    // Workaround for AoT problem with namespaces (see angular/angular#15613)
    this.authenticationManager = this.injector.get(MVDHosting.Tokens.AuthenticationManagerToken);
    this.date = new Date();
    this.popupVisible = false;
  }

  ngOnInit(): void {
    this.date = new Date();

    Observable.interval(1000).subscribe(() => this.date = new Date());
  }

  getUsername(): string | null {
    return this.authenticationManager.getUsername();
  }

  getPluginVersion(): string | null {
    return "v. " + this.plugin.version;
  }

  logout(): void {
    this.popupVisible = false;
    this.popupStateChanged.emit(this.popupVisible);
    this.authenticationManager.requestLogout();
  }

  togglePopup(): void {
    this.popupVisible = !this.popupVisible;
    this.popupStateChanged.emit(this.popupVisible);
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (this.popupVisible && event
        && !this.userIcon.nativeElement.contains(event.target)
        && this.logoutButton.nativeElement !== event.target
        // Convenience widgets for testing the i18n work
        // && this.languageButton.nativeElement !== event.target
        // && this.clearLanguageButton.nativeElement !== event.target
        // && this.localeButton.nativeElement !== event.target
      ) {
      this.popupVisible = false;
      this.popupStateChanged.emit(this.popupVisible);
    }
  }

  setLanguage(value: string): void {
    this.languageLocaleService.setLanguage(value).subscribe(
      arg => this.logger.debug(`setLanguage, arg=`,arg),
      err => {
        this.logger.warn("setLanguage error=",err);
      }
    )
  }

  setLocale(value: string): void {
    this.languageLocaleService.setLocale('US').subscribe(arg => this.logger.debug(`setLocale, arg=`,arg))
  }
}


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/

