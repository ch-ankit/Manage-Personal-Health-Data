const {Builder, By, Key, until} = require('selenium-webdriver');
const neo4j = require('neo4j-driver');
const driver = neo4j.driver('bolt://54.172.123.120:7687',
                  neo4j.auth.basic('neo4j', 'menu-harmonies-capacity'), 
                  {});
const query =`Match(n{id:"2000-01-0444600"}) Detach Delete n`;
const session = driver.session({database:"neo4j"});
session.run(query);
session.close();
(async function example() {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    await driver.get('http://localhost:3000');
    await driver.findElement(By.id("about")).click();
    await driver.findElement(By.id('sign')).click();
    await driver.findElement(By.id('name')).sendKeys("pixcal");
    await driver.findElement(By.id('address')).sendKeys('pokhara');
    await driver.findElement(By.id('email')).sendKeys('presentator39@gmail.com'); 
    await driver.findElement(By.id('language')).sendKeys('Nepali'); 
    await driver.findElement(By.id('Single')).click();
    await driver.findElement(By.id('zipCode')).sendKeys('44600'); 
    await driver.findElement(By.id('dob')).sendKeys('2000-01-04');
    await driver.findElement(By.id('contactInfo')).sendKeys('9812345678');
    await driver.findElement(By.id('image')).sendKeys('/home/root39/Pictures/about.jpeg');
    await driver.findElement(By.id('Occupation')).sendKeys('Engineer');
    await driver.findElement(By.id('gender')).sendKeys('Male');
    await driver.findElement(By.id('emergencyContactName')).sendKeys('Pankit');
    await driver.findElement(By.id('emergencyContactInfo')).sendKeys('9821123456');
    await driver.findElement(By.id('relation')).sendKeys('Roommate');
    await driver.findElement(By.id('submit')).click();
    setTimeout(async()=>{
      await driver.get('http://localhost:3000/passwordSet');
    await driver.findElement(By.id('userId')).sendKeys('2000-01-0444600');
    await driver.findElement(By.id('password')).sendKeys('user1234');
    await driver.findElement(By.id('confirmPassword')).sendKeys('user1234');
    await driver.findElement(By.id('submit')).click();
    
    await driver.get('http://localhost:3000');
    await driver.findElement(By.id("Email")).sendKeys("2000-01-0444600");
    await driver.findElement(By.id("Password")).sendKeys("user1234");
    await driver.findElement(By.id("logIn")).click();
  },10000);
    
  } finally {
    setTimeout(()=>{
        driver.quit();
    },40000)
    
  }
})();