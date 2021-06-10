node {
    def server = Artifactory.server 'JFROG Enterprise'
    def rtNpm = Artifactory.newNpmBuild()
    def buildInfo = Artifactory.newBuildInfo()
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
        
    }

    
    stage ('Publish npm') {
        rtNpm.publish buildInfo: buildInfo
    }

    stage ('Publish build info') {
        server.publishBuildInfo buildInfo
    }
}
