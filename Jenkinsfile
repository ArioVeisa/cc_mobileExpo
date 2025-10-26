pipeline {
    agent any
    
    tools {
        nodejs '18' // Make sure Node.js 18 is configured in Jenkins Global Tools
    }
    
    environment {
        DOCKER_IMAGE = 'cc-mobile-expo'
        DOCKER_TAG = "${BUILD_NUMBER}"
        CONTAINER_NAME = 'cc-mobile-expo-container'
        CI = 'true'
        EXPO_TOKEN = credentials('expo-token') // Optional: for Expo publishing
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                sh 'npm install'
                sh 'npm install -g @expo/cli'
            }
        }
        
        stage('Lint & Type Check') {
            steps {
                echo 'Running TypeScript type checking...'
                sh 'npx tsc --noEmit'
                echo 'TypeScript check passed!'
            }
        }
        
        stage('Expo Doctor') {
            steps {
                echo 'Running Expo Doctor to check project health...'
                sh 'npx expo doctor'
            }
        }
        
        stage('Build Web Version') {
            steps {
                echo 'Building web version...'
                sh 'npx expo export --platform web'
                echo 'Web build completed!'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image for mobile app...'
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
                echo "Docker image built successfully: ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }
        
        stage('Deploy with Docker Compose') {
            steps {
                echo 'Deploying mobile app...'
                sh "docker-compose down || true"
                sh "docker-compose up -d --build"
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Performing health check...'
                sh 'sleep 15'
                sh 'curl -f http://localhost:8081 --max-time 30 || exit 1'
                echo 'Health check passed! Expo dev server is running on port 8081'
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
                echo 'Publishing to Expo (if token provided)...'
                script {
                    if (env.EXPO_TOKEN) {
                        sh 'npx expo publish --non-interactive'
                        echo 'Published to Expo successfully!'
                    } else {
                        echo 'Skipping Expo publish - no token provided'
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up workspace...'
            // Archive web build artifacts
            archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
            cleanWs()
        }
        success {
            echo 'Mobile app pipeline completed successfully!'
            // Optional: Send notification
        }
        failure {
            echo 'Mobile app pipeline failed!'
            // Optional: Send failure notification
        }
    }
}
