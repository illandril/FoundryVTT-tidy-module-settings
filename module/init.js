const CSS_COLLAPSE = 'illandril-settings--collapse';
const CSS_HIDDEN = 'illandril-settings--hidden';
const CSS_SETTINGS_GROUP = 'illandril-settings--group';

const CSS_MODULE_HEADER = 'module-header';

const expandCollapseGroup = (header, optForceSame) => {
  const wasCollapsed = header.classList.contains(CSS_COLLAPSE);
  const expand = optForceSame ? !wasCollapsed : wasCollapsed;
  if (expand) {
    header.classList.remove(CSS_COLLAPSE);
  } else {
    header.classList.add(CSS_COLLAPSE);
  }

  let sibling = header.nextElementSibling;
  while (sibling && !sibling.classList.contains(CSS_MODULE_HEADER)) {
    if (expand) {
      sibling.classList.remove(CSS_HIDDEN);
    } else {
      sibling.classList.add(CSS_HIDDEN);
    }
    sibling = sibling.nextElementSibling;
  }
};

Hooks.on('renderSettingsConfig', (app, html, options) => {
  const coreTabNav = app.form.querySelector('.tabs > .item[data-tab="core"]');
  const modulesTabNav = app.form.querySelector('.tabs > .item[data-tab="modules"]');
  const modulesTab = app.form.querySelector('.tab[data-tab="modules"]');

  const resetSettingsWindowSize = () => {
    // We shouldn't need to lookup and reset the scrollTop... and don't in the standard foundry,
    // but the CSS applied by some skins (including Ernie's Modern UI) causes some browsers to
    // forget where the settings dialog was scrolled to when the height is recalculated.
    const scrollRegion = app.form.querySelector('#config-tabs');
    const initialScrollTop = scrollRegion.scrollTop;
    app.setPosition({ height: 'auto' });
    scrollRegion.scrollTop = initialScrollTop;
  };

  const settingsList = modulesTab.querySelector('.settings-list');

  const headers = settingsList.querySelectorAll(`.${CSS_MODULE_HEADER}`);
  for (const header of headers) {
    header.addEventListener(
      'click',
      () => {
        expandCollapseGroup(header);
        resetSettingsWindowSize();
      },
      false
    );
    expandCollapseGroup(header);
  }
  if (modulesTabNav.classList.contains('active')) {
    resetSettingsWindowSize();
  }

  // Some other modules (SocketSettings) do funky things and add to the Settings list at unpredictable times
  const observer = new MutationObserver(() => {
    const headers = settingsList.querySelectorAll(`.${CSS_MODULE_HEADER}`);
    for (const header of headers) {
      expandCollapseGroup(header, true /* forceSame */);
    }
  });
  observer.observe(settingsList, { childList: true });
});
