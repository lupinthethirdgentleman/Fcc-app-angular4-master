import { FccAppPage } from './app.po';

describe('fcc-app App', function() {
  let page: FccAppPage;

  beforeEach(() => {
    page = new FccAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
