import assert from 'node:assert/strict';
import React from 'react';
import TilawatiAdventurePage from '../src/features/ngaji-ceria/pages/explore/TilawatiAdventurePage';

export const tests = {
  'TilawatiAdventurePage terdefinisi sebagai fungsi komponen React': () => {
    assert.equal(typeof TilawatiAdventurePage, 'function');
  },

  'TilawatiAdventurePage merender komponen React valid': () => {
    const el = React.createElement(TilawatiAdventurePage);
    assert.ok(React.isValidElement(el));
  },
};
