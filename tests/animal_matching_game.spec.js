const { test, expect } = require('@playwright/test');
const { exec } = require('child_process');

test.describe('Animal Matching Game', () => {
  let server;

  test.beforeAll(async () => {
    // Start a simple web server to serve the static files.
    server = exec('python3 -m http.server 3000');
    // Wait for the server to start up.
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test.afterAll(() => {
    // Stop the server after all tests are done.
    server.kill();
  });

  test('should start the game and display cards', async ({ page }) => {
    // Listen for console messages
    page.on('console', msg => {
      console.log(`Browser console: ${msg.text()}`);
    });

    await page.goto('http://localhost:3000/rika/animals/animal_matching_game.html');
    
    // Assert that the game board is present
    await expect(page.locator('#game-board')).toBeVisible();

    // Click the "ゲーム開始" button
    await page.click('button:has-text("ゲーム開始")');
    
    // Wait for the timer to update, indicating the game has started
    await expect(page.locator('#time')).not.toHaveText('0', { timeout: 10000 });

    // Assert that cards are visible
    await expect(page.locator('#game-board .card')).toHaveCount(16, { timeout: 10000 });
  });
});