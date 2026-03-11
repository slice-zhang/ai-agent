const {Controller} = require("egg");

class HomeController extends Controller {
    async index() {
        const {ctx} = this;
        const res = await ctx.service.home.index();
        ctx.body = res;
    }
}

module.exports = HomeController;
