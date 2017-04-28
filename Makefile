STATIC = /usr/share/yinlifang

all: install db serve

install:
	@npm install pm2 -g
	@npm install babel-cli -g
	@echo 'successfully install dependencies'

db:
	@mongod -f ./mongo.conf &
	@echo 'successfully start database'
static:
	rm -rf $(STATIC)/*
	mkdir $(STATIC)/admin
	cp ../admin/dist/index.html $(STATIC)/admin/
	cp -r ../admin/dist/static $(STATIC)
	cp -r ../fore-end/dist/* $(STATIC)

serve:
	@npm run build
	@pm2 start ./pm2.json

