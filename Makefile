deploy: frontend_stop_service frontend_build frontend_start_service

frontend_build:
	-docker build -t eposkk/boco-frontend .

frontend_start_service:
	-docker run -d --name boco-frontend -p 80:80 eposkk/boco-frontend

frontend_stop_service:
	-docker stop eposkk/boco-frontend
	-docker rm eposkk/boco-frontend