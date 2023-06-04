<!-- BUILD THE THE IMAGE -->

 docker build -t pgshard .

<!-- RUN THE CONTAINERS -->

 a. docker run --name pgshard1 -p 5435:5432 -e POSTGRES_PASSWORD=postgres -d pgshard

 b. docker run --name pgshard2 -p 5436:5432 -e POSTGRES_PASSWORD=postgres -d pgshard

 c. docker run --name pgshard3 -p 5437:5432 -e POSTGRES_PASSWORD=postgres -d pgshard
