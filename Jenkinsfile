pipeline {
    agent any

    environment {
        IMAGE_NAME = 'codevault'
        CONTAINER_NAME = 'codevault'
        PORT = '3000'
    }

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
                sh 'docker build -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true

                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p ${PORT}:3000 \
                        -v /opt/codevault/data:/app/database \
                        ${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Verify') {
            steps {
                sh '''
                    sleep 5
                    curl --fail http://localhost:${PORT}/health
                '''
            }
        }
    }

    post {
        success {
            echo 'CodeVault pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Deployment/verification did not complete successfully.'
        }
    }
}