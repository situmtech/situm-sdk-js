# Starts servers
build:
	@echo -e "Building service… \n"
	yarn install
	npm build

test:
	@echo -e "Launch tests …\n"
	yarn test
