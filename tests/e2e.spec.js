const { test, expect } = require('@playwright/test');
const { exec } = require('child_process');

test.describe('Website Navigation and Map Test', () => {
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

  test('should navigate to the sansu page correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/index.html');
    // Find the "算数" link and click it.
    await page.click('a:has-text("算数")');
    // Check that the URL is correct after navigation.
    await expect(page).toHaveURL('http://localhost:3000/sansu/sansu.html');
  });

  test('should display the chiri map correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/shakai/chiri.html');
    const mapContainer = page.locator('#japan-map');
    // Check that the map container has an SVG element, which means the map has been rendered.
    await expect(mapContainer.locator('svg')).toBeVisible();
    // Take a screenshot of the page.
    await page.screenshot({ path: 'chiri-map-test.png' });
  });
});
