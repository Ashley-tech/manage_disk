Cmd lancement pour déploiement : docker-compose up --build
Attention, il faut penser à re-commenter les url avec localhost:8080... puis décommenter ceux avec back:8079
(Souci connexion avec back)

Pour le tester en local :
-Terminal 1 : cd manage_disk_back && mvnw spring-boot:run ou cd manage_disk_back && ./mvnw spring-boot:run
-Terminal 2 : cd manage_disk_front && npm run web
Attention, dans ce cas, il faut penser à décommenter les url avec localhost:8080... puis re-commenter ceux avec back:8079

Base de données PostgreSQL : db_manage_vdisk
Merci de spécifier le login et mot de passe en fonction de tes paramètres