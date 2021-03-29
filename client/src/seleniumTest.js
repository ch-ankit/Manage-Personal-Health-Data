const {Builder, By, Key, until} = require('selenium-webdriver');

(async function example() {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    await driver.get('http://localhost:3000');
    await driver.findElement(By.id("about")).click();
    await driver.findElement(By.id("home")).click();
    await driver.findElement(By.id("Email")).sendKeys("user1@gmail.com");
    await driver.findElement(By.id("Password")).sendKeys("user12345");
    await driver.findElement(By.id("logIn")).click();
  } finally {
    setTimeout(()=>{
        driver.quit();
    },10000)
    
  }
})();