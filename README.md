# LXO

Simple notice-board with some injection and some ways to prevent them.

Link to docker hub

https://hub.docker.com/repository/docker/szymonzieba/no-injection-lxo

Steps to run projekt with docker

  git clone https://github.com/Szymon-Zieba/starter.git	
  
    git checkout no-injection // with no injection
    
    git checkout injection  // with injection
    
  Start docker, and project
  
    docker compose up
    
  Import database
  
    docker exec -i maria_db mysql -uroot -padmin mysql < mysql.sql
    
  Then go to localhost:3000

If you want to see difference go to branch nad compare 2 branches with each other.
https://github.com/Szymon-Zieba/LXO/compare/no-injection...injection

