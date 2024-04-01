const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(stealthPlugin());

const { executablePath } = require('puppeteer');
const captchaExtractor = require('../utils/capchaExtractor');


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const irctcData = async (url, userName, password) => {
    const browser = await puppeteer.launch({
        headless: false, executablePath: executablePath(),
        defaultViewport: null,
    });
    const page = await browser.newPage();

    // Get the screen resolution
    const screenResolution = await page.evaluate(() => {
        return {
            width: window.screen.width,
            height: window.screen.height
        };
    });

    // Set the viewport size to match the screen resolution
    await page.setViewport({
        width: screenResolution.width,
        height: screenResolution.height,
        deviceScaleFactor: 1,
    });

    // Navigate the page to a URL
    await page.goto(url);
    await page.click('.search_btn.loginText.ng-star-inserted');
    await sleep(1000);
    // await page.waitForSelector('.search_btn.loginText.ng-star-inserted', { visible: true });
    // await page.type(".form-control.input-box.ng-valid.ng-dirty.ng-touched", userName);

    await page.keyboard.type(userName);
    await page.keyboard.press('Tab');
    await page.keyboard.type(password);
    // form-control input-box ng-valid ng-dirty ng-touched
    const imageUrl = await page.$eval('.captcha-img', img => img.getAttribute('src'));
    const captchText = await captchaExtractor(imageUrl);
    console.log("captcha", captchText)
    const stringWithoutSpaces = captchText.split(' ').join('');
    console.log(stringWithoutSpaces.length)
    await page.keyboard.press('Tab');

    await page.keyboard.type(stringWithoutSpaces);
    await sleep(10000);
    // await page.keyboard.press('Tab');
    // await page.keyboard.press('Tab');

    // await page.keyboard.press('Enter');
    // await page.type("#4460565", password);
    // await page.click('search_btn train_Search');


    // await sleep(1000) // For removing bot protection
    // const productHandles = await page.$$('.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item');
    // const prdtArray = []
    // for (const productHandle of productHandles) {
    //     try {
    //         const productBrand = await page.evaluate(el => el.querySelector('.a-size-base-plus.a-color-base').textContent, productHandle);
    //         const productImageUrl = await page.evaluate(el => el.querySelector('.s-image').getAttribute('src'), productHandle);
    //         const productName = await page.evaluate(el => el.querySelector('h2 > a > span').textContent, productHandle);
    //         const productPrice = await page.evaluate(el => el.querySelector('.a-price-whole').textContent, productHandle);
    //         const productUrl = await page.evaluate(el => el.querySelector('.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal').getAttribute("href"), productHandle);
    //         const obj = {
    //             productBrand, productName, productImageUrl, productPrice, productUrl
    //         }
    //         prdtArray.push(obj)
    //     } catch (error) {

    //     }

    // }

    await browser.close();

    // return prdtArray;

}

module.exports = irctcData;