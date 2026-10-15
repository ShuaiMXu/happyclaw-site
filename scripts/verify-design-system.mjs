// Real-browser regression checks using the existing Harness runtime.
// HARNESS_ROOT=/path/creative-os node scripts/verify-design-system.mjs --url URL --out DIRECTORY
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
const require=createRequire(import.meta.url),runtime=process.env.HARNESS_ROOT||process.cwd();
const {chromium}=require(require.resolve('playwright-core',{paths:[runtime]}));
const value=name=>{const i=process.argv.indexOf(name);return i<0?undefined:process.argv[i+1];};
const url=value('--url'),out=resolve(value('--out')||'/tmp/happyclaw-design-system-check');assert.ok(url?.startsWith('http'),'Provide the real preview --url');await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'chrome',headless:true}),checks=[];
try{
 for(const width of [320,390,768,1280]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage();await page.goto(url,{waitUntil:'networkidle'});
  assert.equal(await page.locator('.brand-mark').count(),3,'Header, hero and footer share the brand implementation');
  assert.equal(await page.locator('.github-icon').count(),3,'Both navigation variants and the hero share the icon');
  assert.ok((await page.locator('.github-icon').evaluateAll(icons=>icons.map(i=>i.getAttribute('aria-hidden')))).every(x=>x==='true'));
  await page.locator('#screenshots').scrollIntoViewIfNeeded();
  await page.locator('#panel-web').focus();await page.keyboard.press('Tab');
  const imageLink=page.locator('[data-panel="web"] figure:first-child > a');
  assert.equal(await imageLink.evaluate(e=>document.activeElement===e&&getComputedStyle(e).display==='block'&&getComputedStyle(e).outlineStyle!=='none'),true,'The original-image link has a block-sized keyboard focus target');
  const normal=await page.evaluate(()=>{const header=document.querySelector('.header-brand').getBoundingClientRect(),content=document.querySelector('#capabilities .content-wide').getBoundingClientRect();const titles=[...document.querySelectorAll('.group-title')].map(e=>{const s=getComputedStyle(e);return [s.fontSize,s.fontWeight,s.lineHeight].join('|')});return{headerLeft:header.left,contentLeft:content.left,titles,overflow:document.documentElement.scrollWidth>innerWidth};});
  assert.ok(Math.abs(normal.headerLeft-normal.contentLeft)<=1);assert.equal(normal.overflow,false);assert.equal(new Set(normal.titles).size,1);
  await page.emulateMedia({reducedMotion:'no-preference'});
  const motion=await page.evaluate(()=>({navigation:getComputedStyle(document.querySelector('.navigation-link')).transitionDuration,button:getComputedStyle(document.querySelector('.button')).transitionDuration}));
  assert.equal(motion.navigation,'0.16s');assert.ok(motion.button.split(',').every(x=>x.trim()==='0.16s'));
  await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.animate-drift').first().evaluate(e=>getComputedStyle(e).animationName),'none');
  assert.ok((await page.locator('.button').first().evaluate(e=>getComputedStyle(e).transitionDuration)).split(',').every(x=>x.trim()==='0s'));
  // Explicit text-size simulation, not a physical-device or browser zoom claim.
  await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  await page.waitForFunction(()=>Math.abs(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'))-(document.querySelector('header nav').getBoundingClientRect().height+1))<1);
  const resized=await page.evaluate(()=>{const brand=document.querySelector('.header-brand').getBoundingClientRect(),toggle=document.querySelector('#menu-toggle').getBoundingClientRect();return{overflow:document.documentElement.scrollWidth>innerWidth,brandRight:brand.right,toggleLeft:toggle.left,toggleVisible:toggle.width>0,headerHeight:document.querySelector('header nav').getBoundingClientRect().height};});
  assert.equal(resized.overflow,false,'200% text must reflow at '+width);if(resized.toggleVisible)assert.ok(resized.brandRight<=resized.toggleLeft,'Wordmark and menu must not overlap');
  for(const button of await page.locator('[data-copy-command]').all())assert.equal(await button.evaluate(e=>{const p=e.closest('.command-step').getBoundingClientRect(),r=e.getBoundingClientRect();return r.left>=p.left&&r.right<=p.right&&r.width>=44&&r.height>=44}),true,'Copy actions remain inside their step');
  if(width<768){
   const heroPadding=await page.locator('.hero-content').evaluate(e=>getComputedStyle(e).paddingTop);await page.locator('#menu-toggle').click();
   assert.equal(await page.locator('.hero-content').evaluate(e=>getComputedStyle(e).paddingTop),heroPadding,'Opening an overlay menu must not move hero content');
   await page.locator('#mobile-menu a[href="#quickstart"]').press('Enter');
   await page.waitForFunction(()=>{const top=document.querySelector('#quickstart').getBoundingClientRect().top,bottom=document.querySelector('header').getBoundingClientRect().bottom;return top>=bottom-1&&top<=bottom+12});
   await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement===document.querySelector('[data-copy-command]')),true,'Keyboard navigation continues into the selected section');
  }else await page.locator('#quickstart').scrollIntoViewIfNeeded();
  await page.screenshot({path:join(out,`text-resize-${width}.png`)});checks.push({width,textResize:'200% root font-size',normal,resized,motion});await context.close();
 }
 await writeFile(join(out,'result.json'),JSON.stringify({status:'pass',checks,limitations:['Chrome desktop automation and explicit text resizing; not physical-device or all-browser coverage.']},null,2));console.log('PASS: shared branding, grid/type/motion tokens, reduced motion, 200% text reflow, non-overlapping navigation, copy controls and keyboard anchor recovery at four widths.');
}finally{await browser.close();}
