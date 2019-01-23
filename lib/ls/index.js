const { getList } = require("../../utils/index");
const chalk = require("chalk");

function getVideoStatus() {
  let page = 1;

  init().then(res => {
    console.log(chalk.green("=========="));
    console.log(
      `截止到${chalk.green(new Date())},最新的一条听写视频是${chalk.green(
        res.data[0].title
      )}`
    );
  });

  async function init() {
    return new Promise(async (resolve, reject) => {
      let result = await getList(page);
      if (result.total > 0) {
        resolve(result);
      } else {
        page++;
        init();
      }
    });
  }
}

getVideoStatus();
