const CSS_COLLAPSE = 'illandril-settings--collapse';
const CSS_SETTINGS_GROUP = 'illandril-settings--group';

const CSS_MODULE_HEADER = 'module-header';

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
    app.setPosition({height: "auto"});
    scrollRegion.scrollTop = initialScrollTop;
  };

  const settingsList = modulesTab.querySelector('.settings-list');
  let settingsGroup = null;
  const children = Array.prototype.slice.call(settingsList.children);
  children.forEach((child) => {
    if (child.classList.contains(CSS_MODULE_HEADER)) {
      child.addEventListener(
        'click',
        () => {
          if (child.classList.contains(CSS_COLLAPSE)) {
            child.classList.remove(CSS_COLLAPSE);
          } else {
            child.classList.add(CSS_COLLAPSE);
          }
          resetSettingsWindowSize();
        },
        false
      );
      child.classList.add(CSS_COLLAPSE);
      settingsGroup = document.createElement('div');
      settingsGroup.classList.add(CSS_SETTINGS_GROUP);
      child.parentNode.insertBefore(settingsGroup, child.nextSibling);
    } else if (settingsGroup !== null && settingsGroup !== child) {
      settingsGroup.appendChild(child);
    }
  });
  if(modulesTabNav.classList.contains('active')) {
    resetSettingsWindowSize();
  }
});
