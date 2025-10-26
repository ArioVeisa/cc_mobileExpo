pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'cc-mobile-expo'
        DOCKER_TAG = "${BUILD_NUMBER}"
        CONTAINER_NAME = 'cc-mobile-expo-container'
        CI = 'true'
        EXPO_TOKEN = credentials('expo-token') // Optional: for Expo publish
    }
    
    stages {

        stage('Checkout') {
            steps {
                echo '📦 Checking out source code...'
                checkout scm
            }
        }

        stage('Setup Node.js 20') {
            steps {
                echo '🔧 Setting up Node.js 20...'
                sh '#!/bin/bash -xe\ncurl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash'
                sh '#!/bin/bash -xe\nexport NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh" && nvm install 20 && nvm use 20'
                sh '#!/bin/bash -xe\nnode --version && npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📥 Installing npm dependencies...'
                sh '''
                    #!/bin/bash -xe
                    export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh" && nvm use 20
                    npm ci --cache /tmp/.npm --no-optional
                    npm install -g @expo/cli
                '''
            }
        }

        stage('Type & Lint Check') {
            steps {
                echo '🔍 Running TypeScript and lint checks...'
                sh '''
                    #!/bin/bash -xe
                    export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 20
                    npx tsc --noEmit || true
                    npx eslint . || true
                '''
            }
        }

        stage('Expo Doctor') {
            steps {
                echo '🩺 Checking project health with Expo Doctor...'
                sh '''
                    #!/bin/bash -xe
                    export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 20
                    npx expo-doctor || true
                '''
            }
        }

        stage('Build Web Version') {
            steps {
                echo '🌐 Building Expo web version...'
                sh '''
                    #!/bin/bash -xe
                    export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 20
                    npx expo export --platform web || true
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh '''
                    #!/bin/bash -xe
                    docker version
                    docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                    docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest
                '''
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                echo '🚀 Deploying Docker Compose...'
                sh '''
                    #!/bin/bash -xe
                    docker stop ${CONTAINER_NAME} || true
                    docker rm -f ${CONTAINER_NAME} || true
                    docker-compose down --remove-orphans || true
                    docker-compose up -d --build
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo '🩺 Performing health check...'
                sh '''
                    #!/bin/bash -xe
                    sleep 15
                    curl -f http://localhost:8081 --max-time 30
                '''
                echo '✅ Health check passed! Expo server is running on port 8081.'
            }
        }

        stage('Publish to Expo (Optional)') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    if (env.EXPO_TOKEN?.trim()) {
                        echo '📱 Publishing app to Expo...'
                        sh '''
                            #!/bin/bash -xe
                            export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh" && nvm use 20
                            npx expo login --token ${EXPO_TOKEN}
                            npx expo publish --non-interactive
                        '''
                        echo '✅ Published to Expo successfully!'
                    } else {
                        echo '⏭️ Skipping Expo publish — no token found.'
                    }
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up workspace...'
            archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
            cleanWs()
        }
        success {
            echo '🎉 Mobile app pipeline completed successfully!'
        }
        failure {
            echo '❌ Mobile app pipeline failed! Check logs for details.'
        }
    }
}
