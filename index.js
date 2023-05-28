const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const templatePath = path.resolve(__dirname, 'template.ejs');
    const outputPath = path.resolve(__dirname, 'tmp', 'output.pdf');

    const data = {
        header: {
            title: 'Mi Empresa Database',
        },
        message: '¡Bienvenido a mi pdf!',
        numItems: 100,
        itemsPerPage: 50,
    };

    const htmlContent = await ejs.renderFile(templatePath, data);

    // Inicia una nueva instancia del navegador Chromium.
    const browser = await puppeteer.launch({ headless: 'new' });
    
    // Abre una nueva página.
    const page = await browser.newPage();

    // Establece el contenido de la página con la cadena HTML proporcionada.
    await page.setContent(htmlContent);

    // Configura las opciones para guardar como PDF (tamaño de papel, márgenes, etc.)
    const pdfOptions = {
        path: outputPath,
        format: 'letter',
        margin: { top: '0cm', right: '0cm', bottom: '3cm', left: '0cm' },
        printBackground: true,
        preferCSSPageSize : true,
        timeout: 200_000,
    };

    await page.waitForFunction("document.readyState === 'complete'")
    // Guarda la página actual como PDF usando las opciones configuradas.
    await page.pdf(pdfOptions);

    // Cierra el navegador Chromium.
    await browser.close();

    res.send(htmlContent);
});
  
app.listen(port, () => {
console.log(`Servidor iniciado en http://localhost:${port}`);
});