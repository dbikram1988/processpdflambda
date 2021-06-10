node {
    def server = Artifactory.server('https://bikramdutta.jfrog.io/artifactory')
    def rtNpm = Artifactory.newNpmBuild()
    def buildInfo

    stage ('Clone') {
        git url: 'https://github.com/dbikram1988/processpdflambda.git'
    }

    stage ('Artifactory configuration') {
        rtNpm.deployer repo: 'processpdf', server: server
        rtNpm.resolver repo: 'processpdf', server: server
        rtNpm.tool = nodejs // Tool name from Jenkins configuration
        buildInfo = Artifactory.newBuildInfo()
    }

    stage ('Install npm') {
        rtNpm.install buildInfo: buildInfo
    }

    stage ('Publish npm') {
        rtNpm.publish buildInfo: buildInfo
    }

    stage ('Publish build info') {
        server.publishBuildInfo buildInfo
    }
}
