var baseConfig = require('../configs/base_config');

module.exports = {
	mConnectDb:baseConfig.get("mongo:db")
}
