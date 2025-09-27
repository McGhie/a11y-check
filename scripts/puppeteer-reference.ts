import puppeteer from 'puppeteer';

// ============================================================================
// PUPPETEER DOM INTERACTION REFERENCE
// ============================================================================
// This file contains examples of Puppeteer commands for DOM interactions.
// All examples use ID selectors where possible for clarity.
// ============================================================================

async function puppeteerReference() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // ============================================================================
  // BASIC ELEMENT SELECTION
  // ============================================================================

  // Wait for element to appear
  await page.waitForSelector('#myButton', { timeout: 30000 });

  // Check if element exists
  const elementExists = await page.$('#myButton');
  if (elementExists) {
    console.log('Element found');
  }

  // Get element count
  const elementCount = await page.$$('#myButton');
  console.log(`Found ${elementCount.length} elements`);

  // ============================================================================
  // CLICKING ELEMENTS
  // ============================================================================

  // Simple click
  await page.click('#myButton');

  // Click with options
  await page.click('#myButton', { 
    button: 'left', 
    clickCount: 1, 
    delay: 100 
  });

  // Double click
  await page.click('#myButton', { clickCount: 2 });

  // Right click
  await page.click('#myButton', { button: 'right' });

  // Click and wait for navigation
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('#myButton')
  ]);

  // ============================================================================
  // TYPING AND INPUT
  // ============================================================================

  // Type text into input
  await page.type('#myInput', 'Hello World');

  // Type with options
  await page.type('#myInput', 'Hello World', { 
    delay: 100 // milliseconds between keystrokes
  });

  // Clear and type
  await page.click('#myInput', { clickCount: 3 }); // Select all
  await page.type('#myInput', 'New text');

  // Type and press Enter
  await page.type('#myInput', 'Search term');
  await page.keyboard.press('Enter');

  // ============================================================================
  // FORM INTERACTIONS
  // ============================================================================

  // Select dropdown option
  await page.select('#mySelect', 'option-value');

  // Check checkbox
  await page.check('#myCheckbox');

  // Uncheck checkbox
  await page.uncheck('#myCheckbox');

  // Upload file
  const fileInput = await page.$('#myFileInput');
  if (fileInput) {
    await fileInput.uploadFile('/path/to/file.pdf');
  }

  // ============================================================================
  // KEYBOARD INTERACTIONS
  // ============================================================================

  // Press single key
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Escape');

  // Key combinations
  await page.keyboard.down('Control');
  await page.keyboard.press('a');
  await page.keyboard.up('Control');

  // Type special characters
  await page.keyboard.type('Hello World!');

  // ============================================================================
  // MOUSE INTERACTIONS
  // ============================================================================

  // Hover over element
  await page.hover('#myButton');

  // Move mouse to coordinates
  await page.mouse.move(100, 200);

  // Drag and drop
  await page.mouse.down();
  await page.mouse.move(200, 300);
  await page.mouse.up();

  // ============================================================================
  // ELEMENT PROPERTIES AND ATTRIBUTES
  // ============================================================================

  // Get element text content
  const text = await page.$eval('#myElement', el => el.textContent);
  console.log('Text:', text);

  // Get element inner HTML
  const html = await page.$eval('#myElement', el => el.innerHTML);
  console.log('HTML:', html);

  // Get element attribute
  const href = await page.$eval('#myLink', el => el.getAttribute('href'));
  console.log('Href:', href);

  // Get element value
  const value = await page.$eval('#myInput', el => (el as HTMLInputElement).value);
  console.log('Value:', value);

  // Check if element is visible
  const isVisible = await page.$eval('#myElement', el => {
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });

  // ============================================================================
  // ELEMENT MANIPULATION
  // ============================================================================

  // Set element attribute
  await page.$eval('#myElement', (el, attr) => {
    el.setAttribute('data-custom', attr);
  }, 'custom-value');

  // Set element text content
  await page.$eval('#myElement', (el, text) => {
    el.textContent = text;
  }, 'New text content');

  // Set input value
  await page.$eval('#myInput', (el, value) => {
    (el as HTMLInputElement).value = value;
  }, 'New input value');

  // Add CSS class
  await page.$eval('#myElement', el => {
    el.classList.add('new-class');
  });

  // Remove CSS class
  await page.$eval('#myElement', el => {
    el.classList.remove('old-class');
  });

  // ============================================================================
  // WAITING AND TIMING
  // ============================================================================

  // Wait for specific time
  await page.waitForTimeout(2000); // 2 seconds

  // Wait for element to be visible
  await page.waitForSelector('#myElement', { visible: true });

  // Wait for element to be hidden
  await page.waitForSelector('#myElement', { hidden: true });

  // Wait for function to return true
  await page.waitForFunction(() => {
    return document.querySelector('#myElement') !== null;
  });

  // Wait for network to be idle
  await page.waitForNetworkIdle({ idleTime: 500, timeout: 30000 });

  // ============================================================================
  // SCROLLING
  // ============================================================================

  // Scroll to element
  await page.evaluate(() => {
    document.querySelector('#myElement')?.scrollIntoView();
  });

  // Scroll by pixels
  await page.evaluate(() => {
    window.scrollBy(0, 500);
  });

  // Scroll to top
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  // ============================================================================
  // NESTED SELECTOR EXAMPLE
  // ============================================================================
  // Example: Find a button inside a div with ID, inside a class

  // Method 1: Using CSS selector
  const nestedButton = await page.$('#containerId .myClass button');
  if (nestedButton) {
    await nestedButton.click();
  }

  // Method 2: Using page.evaluate for complex selection
  const foundElement = await page.evaluate(() => {
    const container = document.querySelector('#containerId');
    if (container) {
      const classElement = container.querySelector('.myClass');
      if (classElement) {
        const button = classElement.querySelector('button');
        return button ? button.textContent : null;
      }
    }
    return null;
  });

  // Method 3: Step-by-step selection
  const container = await page.$('#containerId');
  if (container) {
    const classElement = await container.$('.myClass');
    if (classElement) {
      const button = await classElement.$('button');
      if (button) {
        await button.click();
      }
    }
  }

  // ============================================================================
  // ADVANCED SELECTORS
  // ============================================================================

  // XPath selectors
  const xpathElement = await page.$x("//button[@id='myButton']");
  if (xpathElement.length > 0) {
    await xpathElement[0].click();
  }

  // Complex CSS selectors
  await page.click('#myId button:nth-child(2)');
  await page.click('#myId .class-name[data-attr="value"]');

  // ============================================================================
  // ERROR HANDLING EXAMPLES
  // ============================================================================

  // Safe element interaction
  try {
    await page.waitForSelector('#myButton', { timeout: 5000 });
    await page.click('#myButton');
    console.log('Button clicked successfully');
  } catch (error) {
    console.log('Button not found or click failed:', error);
  }

  // Check element exists before interaction
  const button = await page.$('#myButton');
  if (button) {
    await button.click();
  } else {
    console.log('Button not found');
  }

  // ============================================================================
  // MULTIPLE ELEMENTS
  // ============================================================================

  // Get all elements with same ID (if multiple exist)
  const allButtons = await page.$$('#myButton');
  for (const button of allButtons) {
    await button.click();
  }

  // Get all elements and extract data
  const allTexts = await page.$$eval('#myButton', buttons => 
    buttons.map(button => button.textContent)
  );

  // ============================================================================
  // FRAME INTERACTIONS
  // ============================================================================

  // Work with iframe
  const frame = await page.frames().find(f => f.name() === 'myFrame');
  if (frame) {
    await frame.click('#buttonInFrame');
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================

  await browser.close();
}

// Export for use in other files
export {
  puppeteerReference
};

// Uncomment to run this reference
// puppeteerReference().catch(console.error);
