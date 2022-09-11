const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const consts = require('../constants')

describe('Items in cart', function() {
    let allItems = [];
    let selectedItem;

    before(async function() {
        // increase timeout (async functions might take some time)
        this.timeout(consts.TIMEOUT);
        // Login with user credentials
        const userToken = await userLogin(consts.USERNAME, consts.PASSWORD);
        // Get all items in the cart
        allItems = await fetchCartItems(userToken);
        // Get data about the first item
        selectedItem = await fetchItemById(allItems[0].prod_id);
    })
    
    // Tests
    it('Number of product in cart should be 1', function() {
        chai.expect(allItems).to.have.lengthOf(1);
    })

    it('Price of the selected phone should be 650', function() {
        chai.expect(selectedItem.price).to.equal(650);
    })

    it("Title of the selected phone should be 'Nexus 6'", function() {
        chai.expect(selectedItem.title).to.equal('Nexus 6');
    })

    it('Id of the selected phone should be 3', function() {
        chai.expect(selectedItem.id).to.equal(3);
    })
})

async function userLogin(username, password) {
    let passwordRaw = Buffer.from(password);
    let passwordBase64 = passwordRaw.toString('base64');
    const reqBody = JSON.stringify({"username": username, "password": passwordBase64});
    const res = await chai.request(consts.API_BASE_URL)
    .post('/login')
    .send(reqBody)
    .set('Content-Type', 'application/json')
    .set('Content-Length', reqBody.length)
    const token = res.body.replace("Auth_token: ", "");
    return token;
}

async function fetchCartItems(userToken) {
    const reqBody = JSON.stringify({cookie: userToken, flag: true});
    const res = await chai.request(consts.API_BASE_URL)
    .post('/viewcart')
    .send(reqBody)
    .set('Content-Type', 'application/json')
    .set('Content-Length', reqBody.length)
    return res.body.Items;
}

async function fetchItemById(id) {
    const reqBody = JSON.stringify({id});
    const res = await chai.request(consts.API_BASE_URL)
    .post('/view')
    .send(reqBody)
    .set('Content-Type', 'application/json')
    .set('Content-Length', reqBody.length)
    return res.body;
} 