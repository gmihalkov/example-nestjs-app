import { strictEqual } from 'node:assert';
import { test } from 'node:test';

test('Test stub', async (scope) => {
  scope.test('NODE_ENV should be "test"', () => {
    strictEqual(process.env.NODE_ENV, 'test');
  });
});
