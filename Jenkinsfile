node {
    def server = Artifactory.server('artifactory.corp.adobe.com/artifactory/api/npm')
    def rtNpm = Artifactory.newNpmBuild()
    def buildInfo

    stage ('Clone') {
        git url: 'https://github.com/dbikram1988/processpdflambda.git'
    }

    stage ('Artifactory configuration') {
        rtNpm.deployer repo: 'npm-doc-management-lambda-release', server: server
        rtNpm.resolver repo: 'npm-doc-management-lambda-release', server: server
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
