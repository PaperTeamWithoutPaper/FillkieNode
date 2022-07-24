module.exports = {
    apps: [{
        name: 'fillkie',
        script: '/home/ubuntu/node-app/build/index.js',
        instances: 0,
        exec_mode: 'cluster'
    }]
}
