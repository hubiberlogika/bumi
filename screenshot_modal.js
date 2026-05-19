const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Set viewport size for better visibility
    await page.setViewportSize({ width: 1280, height: 800 });

    try {
        console.log('Navigating to http://localhost:3001...');
        await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 30000 });

        // Navigate to Operations/Shipments if necessary. 
        // Based on previous context, SHP-S-001 is likely in the Operations view.
        // Let's assume the dashboard or a sidebar link leads there.
        // But first let's try to find SHP-S-001 on the current page.
        
        console.log('Waiting for SHP-S-001...');
        const shipmentSelector = 'text=SHP-S-001';
        await page.waitForSelector(shipmentSelector, { timeout: 10000 });
        
        console.log('Clicking on SHP-S-001...');
        await page.click(shipmentSelector);

        console.log('Waiting for Cost Tracking button...');
        const costTrackingSelector = 'button:has-text("Cost Tracking")';
        await page.waitForSelector(costTrackingSelector, { timeout: 10000 });
        
        console.log('Clicking on Cost Tracking button...');
        await page.click(costTrackingSelector);

        console.log('Waiting for Cost Tracking modal...');
        await page.waitForSelector('text=Cost Tracking & Margin Analysis', { timeout: 10000 });

        console.log('Taking screenshot...');
        await page.screenshot({ path: 'cost_tracking_modal.png' });
        console.log('Screenshot saved as cost_tracking_modal.png');

    } catch (error) {
        console.error('Error during execution:', error);
        await page.screenshot({ path: 'error_screenshot.png' });
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
