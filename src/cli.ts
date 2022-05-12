import cac from 'cac'
import { Log, isExitAddFile, isGitRep } from './utils/utils'
import { CommitConfig, commitType } from './commit/commitType'
import { commit } from './commit/commitinput'
import { version } from '../package.json'

const cli = cac('commit')

// cli命令数组
cli.commands = [
  cli
    .command('', `写完代码以后，终端输入-->  commit  <--然后尽情享受吧 🎉`)
    // .option(
    //   'autoPush',
    //   '是否自动提交到远程仓库,默认为false (Automatically push to remote after committing, default is false)',
    //   {
    //     default: false
    //   }
    // )
    // .option('isGerrit', '是否是gerrit仓库,默认为false (Is gerrit repository, default is false)', {
    //   default: false
    // })
    .action(() => {
      Log.info('开始提交代码...')
      const config: CommitConfig = {}
      config.types = commitType
      // console.warn('opts参数', config)

      if (isGitRep()) {
        Log.error('不是git仓库,请先切换到git仓库 (Not a git repository, please switch to git repository)')
        return
      }

      // todo:由于此方法太耗时，因此先不使用，寻找解决方案。。。
      // if (isGitNeedPull()) {
      //   Log.error(
      //     'git存储库需要拉取,请先git pull命令,再执行该命令 (git repository needs pull, please git pull first, then execute this command)'
      //   )
      //   return
      // }

      if (isExitAddFile()) {
        Log.error(
          '存在暂存文件,请先git add命令,在执行该命令 (There are uncommitted files, please git add first,then execute this command)'
        )
        return
      }

      commit(config)
        .then(() => {
          Log.info('提交成功 🎉')
          process.exit(0)
        })
        .catch((err) => {
          Log.error('提交失败 😢', err)
          process.exit(1)
        })
    })
]

cli.help()
cli.version(version)

// 解析命令行参数
cli.parse()
