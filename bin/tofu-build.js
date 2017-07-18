build()
require('../lib/register-logger')('build', process)

function build () {
    require('../webpack/build')()
}
