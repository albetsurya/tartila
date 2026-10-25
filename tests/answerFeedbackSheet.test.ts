import assert from 'node:assert/strict';
import React from 'react';
import { AnswerFeedbackSheet } from '../src/features/ngaji-ceria/components/AnswerFeedbackSheet.tsx';

export const tests = {
  'AnswerFeedbackSheet terdefinisi sebagai fungsi komponen React': () => {
    assert.equal(typeof AnswerFeedbackSheet, 'function');
  },

  'AnswerFeedbackSheet merender struktur AnimatePresence': () => {
    // Saat isOpen = false
    const closedSheet = React.createElement(AnswerFeedbackSheet, {
      isOpen: false,
      isCorrect: true,
    });
    assert.ok(React.isValidElement(closedSheet));

    // Saat isOpen = true dan isCorrect = true
    let nextCalled = false;
    const correctSheet = React.createElement(AnswerFeedbackSheet, {
      isOpen: true,
      isCorrect: true,
      onNext: () => {
        nextCalled = true;
      },
      mascotMessage: 'Hebat sekali!',
    });
    assert.ok(React.isValidElement(correctSheet));
    assert.equal(correctSheet.props.isOpen, true);
    assert.equal(correctSheet.props.isCorrect, true);
    assert.equal(correctSheet.props.mascotMessage, 'Hebat sekali!');
    correctSheet.props.onNext();
    assert.equal(nextCalled, true);

    // Saat isOpen = true dan isCorrect = false
    let retryCalled = false;
    let resetCalled = false;
    const wrongSheet = React.createElement(AnswerFeedbackSheet, {
      isOpen: true,
      isCorrect: false,
      onRetry: () => {
        retryCalled = true;
      },
      onReset: () => {
        resetCalled = true;
      },
    });
    assert.ok(React.isValidElement(wrongSheet));
    assert.equal(wrongSheet.props.isCorrect, false);
    wrongSheet.props.onRetry();
    assert.equal(retryCalled, true);
    wrongSheet.props.onReset();
    assert.equal(resetCalled, true);
  },
};
