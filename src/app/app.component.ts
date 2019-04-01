import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { TranslateService } from './translate';
import { API } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit{

    public translatedText: string;
    public supportedLanguages: any[];

    constructor(
        private _translate: TranslateService,
        private api: API) { }

    ngOnInit() {
        const lang = this.api.lang.getLang();
        this._translate.use(lang);
        if(navigator.userAgent.match(/Android/i)) {
            window.scrollTo(0, 1);
        }
    }
}
