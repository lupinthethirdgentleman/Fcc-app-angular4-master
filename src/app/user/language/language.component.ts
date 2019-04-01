import { Component, OnInit } from '@angular/core';
import { API } from '../../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService } from '../../translate';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent implements OnInit {

    selectedLang:number;

    constructor(
        private api: API,
        private location: Location,
        private router: Router,
        private translate: TranslateService,
    ) {
        this.selectedLang = this.api.lang.getLang() === 'en' ? 0 : 1;
    }

    ngOnInit() {
    }
    // go to prev step
    goBack() {
        this.location.back();
    }

    changedLanguage(lang) {
        this.selectedLang = lang;
        this.api.lang.setLang(this.selectedLang === 0 ? 'en' : 'cn');
        this.translate.use(this.api.lang.getLang());
    }
}
