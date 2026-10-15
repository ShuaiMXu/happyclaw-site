// Uses the existing Creative OS browser runtime; no product runtime dependency.
// HARNESS_ROOT=/path/to/creative-os node scripts/verify-ui.mjs --url http://127.0.0.1:4367 --out /tmp/happyclaw-ui
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {mkdir,writeFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
const require=createRequire(import.meta.url),paths=[process.env.HARNESS_ROOT||process.cwd()];
const playwright=await import(pathToFileURL(require.resolve('playwright-core',{paths})).href);
const {chromium}=playwright.default||playwright;
const axe=require.resolve('axe-core/axe.min.js',{paths});
const value=name=>{const index=process.argv.indexOf(name);return index<0?undefined:process.argv[index+1];},url=value('--url'),out=resolve(value('--out')||'/tmp/happyclaw-ui');
assert.ok(url?.startsWith('http'),'Pass --url for a running real page');await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'chrome',headless:true});
const expectedAssets=['chat-tool-tracking.png','chat-markdown.png','chat-image-gen.png','mobile-login.png','mobile-groups.png','mobile-monitor.png','mobile-settings.png','feishu-chat.png','feishu-card-reply.png'];
// Original 90ae406 diagram labels: extraction changes layout, not product facts.
const expectedArchitecture=['接入层','飞书','Telegram','Web UI','主进程','路由分发','任务队列','会话调度','WebSocket','执行层','宿主机进程','Docker 沙箱','运行时','Claude Agent SDK','MCP Tools','流式输出','存储层','SQLite','会话记忆','文件系统'];
const findings=[],errors=[];
try {
  for(const width of [320,390,768,1280]){
    const context=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});
    const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(url,{waitUntil:'networkidle'});
    assert.equal(await page.locator('main').count(),1);assert.equal(await page.locator('main h1').count(),1);
    assert.equal(await page.locator('#capabilities dt').count(),10,'All original capability claims remain');
    assert.deepEqual((await page.locator('#screenshots img').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src').split('/').pop()))).sort(),expectedAssets.toSorted());
    assert.equal(await page.locator('.architecture-mobile > li').count(),5);
    assert.deepEqual(await page.locator('.architecture-mobile h3, .architecture-mobile > li > ul > li').allTextContents(),expectedArchitecture,'All original architecture names survive extraction');
    assert.deepEqual(await page.locator('#architecture svg text').allTextContents(),expectedArchitecture,'Desktop and mobile retain the same original content');
    assert.equal(await page.locator('.architecture-mobile').isVisible(),width<1024);
    if(width<768){
      await page.locator('#menu-toggle').click();assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'true');assert.equal(await page.locator('.menu-close-icon').isVisible(),true);
      await page.keyboard.press('Escape');assert.equal(await page.locator('#mobile-menu').isVisible(),false);assert.equal(await page.evaluate(()=>document.activeElement?.id),'menu-toggle');
      await page.locator('#menu-toggle').click();await page.locator('#mobile-menu a[href="#quickstart"]').click();assert.equal(await page.locator('#mobile-menu').isVisible(),false);assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
      const rect=await page.locator('#quickstart').boundingBox();assert.ok(rect.y>=70&&rect.y<200,'Menu navigation reaches unobscured quickstart');
    }
    await page.locator('[data-tab="web"]').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('[data-tab="mobile"]').getAttribute('aria-selected'),'true');assert.equal(await page.locator('[data-panel="mobile"]').isVisible(),true);
    await page.keyboard.press('End');assert.equal(await page.locator('[data-tab="feishu"]').getAttribute('aria-selected'),'true');await page.keyboard.press('Home');assert.equal(await page.locator('[data-tab="web"]').getAttribute('aria-selected'),'true');
    await page.addScriptTag({path:axe});
    for(const channel of ['web','mobile','feishu']){
      await page.locator(`[data-tab="${channel}"]`).click();
      const images=page.locator(`[data-panel="${channel}"] img`);
      for(const image of await images.all()){
        await image.scrollIntoViewIfNeeded();await image.evaluate(img=>new Promise((resolve,reject)=>{if(img.complete&&img.naturalWidth)return resolve();img.addEventListener('load',()=>resolve(),{once:true});img.addEventListener('error',()=>reject(Error('Original image failed to load')),{once:true});}));
        assert.equal(await image.evaluate(img=>img.naturalWidth===Number(img.getAttribute('width'))&&img.naturalHeight===Number(img.getAttribute('height'))),true,'Reserved dimensions match the real original');
      }
      const violations=await page.evaluate(async()=> (await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)})));
      findings.push({width,channel,violations});assert.deepEqual(violations,[],`Accessibility defects at ${width}/${channel}: ${JSON.stringify(violations)}`);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'No page-wide horizontal overflow');
    }
    await page.locator('[data-tab="web"]').click();
    const commands=['git clone https://github.com/riba2534/happyclaw.git','cd happyclaw','make start'];
    for(const [index,command] of commands.entries()){
      const button=page.locator('[data-copy-command]').nth(index);await button.click();await page.getByRole('status').nth(index).filter({hasText:'命令已复制'}).waitFor();
      assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),command,'Real Clipboard API receives the original single-line command');
      assert.equal(await page.locator('pre').nth(index).textContent(),command,'The complete original command remains selectable');
      assert.equal(await page.locator('pre').nth(index).evaluate(e=>{const s=getComputedStyle(e);return s.whiteSpace==='pre'&&s.overflowX==='auto'&&e.getBoundingClientRect().right<=innerWidth;}),true,'Long commands scroll within the card without splitting tokens or overflowing the page');
    }
    await page.evaluate(()=>Object.defineProperty(navigator.clipboard,'writeText',{configurable:true,value:()=>Promise.reject(new DOMException('Permission denied','NotAllowedError'))}));
    await page.locator('[data-copy-command]').first().click();await page.locator('#copy-status-clone').filter({hasText:'手动复制'}).waitFor();assert.equal(await page.locator('[data-copy-command]').first().isEnabled(),true);
    await page.locator('[data-copy-command]').first().focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
    assert.notEqual(await page.locator('[data-copy-command]').first().evaluate(e=>getComputedStyle(e).outlineStyle),'none','Actual keyboard navigation displays a visible focus ring');
    await page.screenshot({path:join(out,`quickstart-${width}.png`)});
    if(width===390){
      await page.evaluate(()=>Object.defineProperty(navigator.clipboard,'writeText',{configurable:true,value:()=>new Promise(()=>{})}));
      await page.locator('[data-copy-command]').first().click();assert.equal(await page.locator('[data-copy-command]').first().isDisabled(),true);
      assert.equal(await page.locator('[data-copy-command]').first().getAttribute('aria-busy'),'true');
      await page.waitForFunction(()=>!document.querySelector('[data-copy-command]').disabled,{},{timeout:6500});assert.ok((await page.locator('#copy-status-clone').textContent()).includes('手动复制'));
      await page.locator('#menu-toggle').click();await page.setViewportSize({width:768,height:844});
      await page.waitForFunction(()=>document.getElementById('menu-toggle')?.getAttribute('aria-expanded')==='false');
    }
    await context.close();
  }
  const context=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});const page=await context.newPage();await page.goto(url);assert.equal(await page.locator('#features h3').first().isVisible(),true,'Core content does not depend on JavaScript reveal');assert.equal(await page.locator('#quickstart code').first().isVisible(),true);await context.close();
  assert.deepEqual(errors,[]);await writeFile(join(out,'result.json'),JSON.stringify({viewports:[320,390,768,1280],checks:['all 10 capabilities','all 9 original assets and dimensions','5 readable mobile architecture layers','menu Escape/nav/resize','tabs keyboard/click','native clipboard values','clipboard denial recovery','command wrapping','focus','no page overflow','WCAG-tagged axe checks','content without JavaScript'],findings,errors},null,2));
  console.log('PASS: four real viewports, three channels, exact clipboard success/error paths, keyboard menu/tabs, preserved content/assets, no page overflow or WCAG-tagged axe violations.');
}finally{await browser.close();}
