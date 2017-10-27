import { InsAlways02Page } from './app.po';

describe('ins-always02 App', () => {
  let page: InsAlways02Page;

  beforeEach(() => {
    page = new InsAlways02Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
