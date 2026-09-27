pipeline {
    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t codevault .'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deployment stage will be configured with EC2.'
            }
        }

        stage('Verify') {
            steps {
                echo 'Verification stage will be configured after EC2 deployment.'
            }
        }
    }
}