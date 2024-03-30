const express = require('express');

const app = express()
const PORT = 3000;
const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(stealthPlugin());

const { executablePath } = require('puppeteer');


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const amazonData = async (url, searchParam) => {
    const browser = await puppeteer.launch({
        headless: true, executablePath: executablePath(),
        defaultViewport: false,
        userDataDir: './tmp'

    });
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto(url);
    await page.type("#twotabsearchtextbox", searchParam);
    await page.waitForSelector('#twotabsearchtextbox', { visible: true });
    await page.click('#nav-search-submit-button');
    await sleep(1000) // For removing bot protection
    const productHandles = await page.$$('.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item');
    // const anotherPattern = await page.$$(".s-main-slot .s-result-list .s-search-results .sg-row")
    // console.log(productHandles.length)
    // console.log(anotherPattern.length)
    const prdtArray = []
    const anotherProduct = [];
    for (const productHandle of productHandles) {
        try {
            const productBrand = await page.evaluate(el => el.querySelector('.a-size-base-plus.a-color-base').textContent, productHandle);
            const productImageUrl = await page.evaluate(el => el.querySelector('.s-image').getAttribute('src'), productHandle);
            const productName = await page.evaluate(el => el.querySelector('h2 > a > span').textContent, productHandle);
            const productPrice = await page.evaluate(el => el.querySelector('.a-price-whole').textContent, productHandle);
            const productUrl = await page.evaluate(el => el.querySelector('.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal').getAttribute("href"), productHandle);
            const obj = {
                productBrand, productName, productImageUrl, productPrice, productUrl
            }
            // const newProductName = await page.evaluate(el => el.querySelector('.a-price-whole').textContent, productHandle);
            // console.log("Print : "+productHandle)
            // anotherProduct.push({ newProductName })
            prdtArray.push(obj)
            // console.log(obj)
            // console.log("Product Brand : ", productBrand + "\n" + "Product name : ", productName + '\n' + "Product Price : ", productPrice + '\n' + "Product Url : ", productUrl + '\n' + "Product Image: ", productImageUrl);
        } catch (error) {
            // console.error(error)
        }

    }



    await page.screenshot({ path: 'example.png' })

    // console.log("First Length : ", prdtArray.length);
    // console.log("Second Length : ", anotherProduct.length);

    await browser.close();

    return prdtArray;

}

module.exports = amazonData;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

