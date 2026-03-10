const { Controller } = require("egg");

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    console.log("ctx.service", ctx.service);

    const res = await ctx.service.home.index();
    ctx.body = res;
  }
}

module.exports = HomeController;
