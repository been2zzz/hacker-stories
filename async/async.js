// async & await
// clear style of using promise :)

// 1. async 자동으로 promise처럼 만들 수 있음
async function fetchUser() {
    return 'ellie';
}

const user = fetchUser();
user.then(console.log);
console.log(user);

// 2. await
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getApple() {
    await delay(2000)
    return '🍎';
}

async function getBanana() {
    await delay(1000)
    return '🍌';
}

// 위와 상동 
// function getBanana() {
//     return delay(1000)
//     .then(() => '🍌');
// }

async function pickFruits() {
    // 동시 다발적으로 실행. 병렬적 실행
    const applePromise = getApple();
    const bananaPromise = getBanana();
    const apple = await applePromise;
    const banana = await bananaPromise;
    return `${apple} + ${banana}`;
}

pickFruits().then(console.log)

// 3. useful Promise APIs
function pickAllFruits() {
    return Promise.all([getApple(), getBanana()]).then(fruits =>
        fruits.join(' + ')
    );
}

pickAllFruits().then(console.log)

function pickOnlyOne() {
    return Promise.race([getApple(), getBanana()]);
}

pickOnlyOne().then(console.log)