import { OpaqueToken } from '@angular/core';

import { LANG_EN_NAME, LANG_EN_TRANS } from './lang-en';
import { LANG_CN_NAME, LANG_CN_TRANS } from './lang-cn';

export const TRANSLATIONS = new OpaqueToken('translations');

export const dictionary = {
    [LANG_EN_NAME]: LANG_EN_TRANS,
    [LANG_CN_NAME]: LANG_CN_TRANS
};

export const TRANSLATION_PROVIDERS = [
    { provide: TRANSLATIONS, useValue: dictionary },
];
