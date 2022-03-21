.PHONY: build
build:
	@echo -e "Building service… \n"
	npm install
	npm run build

test:
	@echo -e "Launch tests …\n"
	npm run test