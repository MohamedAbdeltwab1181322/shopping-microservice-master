pipeline{
    agent any
    environment{
        NAME="Mahmoud Abd Alziem"
        DOCKERIZE_VERSION="v0.6.1"
    }
    stages{
        
        stage('build'){
            steps{
                sh '''
                    docker build --network host -t azima/database .
                    echo done
                '''                   
            }
        }
        stage('Docker Login'){
            steps{
             catchError(message : "Failed Login To Docker Hub"){
                 withCredentials([usernamePassword(credentialsId: 'DOCKER_AUTH', passwordVariable: 'pass', usernameVariable: 'user')]) {
                    sh '''
    		        docker login -u ${user} -p ${pass}
                    echo done
                    '''
                } 
             }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
            }
        }
        stage('Push Image'){
            steps{
                catchError(message : "Failed Push Docker Image") {
                    sh '''
                        docker push azima/database
                        echo done
                    '''
                }
            }
        }
        stage('List pods') {
            steps{
                sh '''
                    curl -LO "https://storage.googleapis.com/kubernetes-release/release/v1.20.5/bin/linux/amd64/kubectl"
                    chmod u+x ./kubectl
                    ./kubectl apply -f k8s/
                    echo done
                '''
            }
        }
    }

    post{
        always{
            echo "Start Stages Pipeline"
        }
        success{
            slackSend color: "#fff", message: "Success Publish database Service"
        }
        failure{
            slackSend color: "#000", message: "Failed Publish database Service"
        }
    }
}