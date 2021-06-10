node {
    def server = Artifactory.server 'bikramdutta.jfrog.io'
    def rtNpm = Artifactory.newNpmBuild()
    def buildInfo
    def commit_id
    stage('Preparation') {
      checkout scm
      bat "git rev-parse --short HEAD > .git/commit-id"                        
      commit_id = readFile('.git/commit-id').trim()
    }

   stage('Build') {
      bat 'npm install --only=dev'
   }

    stage ('Artifactory configuration') {
        rtNpm.deployer repo: 'processpdf', server: server
        rtNpm.resolver repo: 'processpdf', server: server
        rtNpm.tool = nodejs // Tool name from Jenkins configuration
        buildInfo = Artifactory.newBuildInfo()
    }

    
    stage ('Publish npm') {
        rtNpm.publish buildInfo: buildInfo
    }

    stage ('Publish build info') {
        server.publishBuildInfo buildInfo
    }
}
