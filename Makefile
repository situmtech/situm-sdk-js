# Starts servers
.PHONY: build
build:
	@echo -e "Building service… \n"
	npm install
	npm run build

test:
	@echo -e "Launch tests …\n"
	npm run test

# RUn with make -B export_sdk_js /home/situm/RubymineProjects/web-dashboard
export_sdk_js:
	@$(MAKE) --no-print-directory build
	@echo "Copy module sdk on dashboard…\n"
	@mkdir -p $(dashboard_path)/node_modules/@situm
	@rm -rf $(dashboard_path)/node_modules/@situm/sdk-js
	@cp -r . $(dashboard_path)/node_modules/@situm/sdk-js
