require('dotenv').config()

const { connect } = require('mongoose')

exports.conectar = async () => {
	connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}).then(() => {
		console.log('Conectado ao MongoDB')
	})
}